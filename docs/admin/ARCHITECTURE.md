# Admin panel — architecture (design, not built)

The Admin panel is ELEVATE's internal tool for working the leads the AI Project Builder
produces. This document fixes its boundaries **before** any UI exists. Data shapes:
`docs/admin/DATA_CONTRACT.md`. Read model: `docs/admin/admin-read-model.draft.sql` (tested by
`scripts/check-admin-contract.ts`).

Prerequisites before building: the Builder migration applied and verified, types regenerated
(`docs/builder/PRODUCTION_PREFLIGHT.md`), and the owner decisions in §11.

## 1. What the existing app imposes (inspected)

| Fact | Consequence for Admin |
|---|---|
| TanStack Start file routes with flat dot naming (`projects.$slug.tsx`), `createFileRoute`, route `head()` | Admin routes follow the same convention (§2) |
| `__root.tsx` `SiteShell` wraps **every** route in site `Nav`, `Footer`, `FloatingCta`, `ContactWidget`, `ExitIntentModal`, `CookieBanner`, and calls `initAnalytics()` (GA4 + Microsoft Clarity after consent) and `trackPageView(pathname)` | Admin must be isolated like `/design`, `/bench`, `/proto` **and** must not run analytics: Clarity records screen content, which would ship lead PII to a third party (§6) |
| Supabase Auth code is generated (`client.ts` with localStorage session, `auth-attacher.ts`, `auth-middleware.ts` → `requireSupabaseAuth` via `getClaims`) but unused; no `src/start.ts` | Authentication reuses it per function, not globally (§3) |
| Builder server functions (`builder.functions.ts`) use the service role through `*.server.ts` modules | Admin uses the same pattern in its own module; the two never import each other |
| `sitemap[.]xml.ts` is a static list; `robots.txt` allows all | Admin never enters the sitemap; pages send `noindex` |
| TanStack Router 1.168 supports per-route `ssr` | Admin routes set `ssr: false` (§5) |

Mode: **Operate** — scanability, density and exactness over expression. It shares the site's
tokens and typefaces, not its cinematic language.

## 2. Routes

| URL | File | Purpose |
|---|---|---|
| `/admin/login` | `admin_.login.tsx` (outside the gated layout) | sign in |
| `/admin` | `admin.tsx` (layout: gate + shell + `<Outlet/>`), `admin.index.tsx` | dashboard |
| `/admin/leads` | `admin.leads.index.tsx` | list: filters, search, pagination |
| `/admin/leads/$leadId` | `admin.leads.$leadId.tsx` | lead detail |
| `/admin/concepts` | `admin.concepts.tsx` | concept gallery across leads |
| `/admin/settings` | `admin.settings.tsx` | integration status (read-only), Admin users (read-only) |

**`/admin/projects` is not proposed.** No projects model exists (no milestones, deliverables,
invoices). A "projects" page today would only be `/admin/leads?status=IN_PROGRESS`, offered as
a saved filter in the leads list. It becomes a route when a projects model is designed.

Every Admin route: `ssr: false`, `head()` with `robots: noindex, nofollow`, no canonical, not in
the sitemap.

## 3. Authentication boundary

- **Identity:** Supabase Auth (email + password, or magic link). Public sign-ups must be
  disabled in the project's Auth settings (owner action). Even if they are not, signing up
  grants nothing (authorization is an allowlist, §4).
- **Transport:** each Admin server function is composed with the generated
  `attachSupabaseAuth` (client side: adds the bearer token) and `requireSupabaseAuth` (server
  side: verifies it with `getClaims`). Not registered globally in `src/start.ts`, so the public
  Builder's functions never receive, depend on, or accidentally accept an Admin token.
- **Session storage — owner decision required (§11):** the generated client keeps the session
  in `localStorage` on the site's origin, which also runs third-party scripts on public pages
  (GA4, Clarity). A script there could read an Admin token from the same origin. Options, best
  first:
  1. Admin on its own origin (e.g. `admin.elevateit.cz`) — full isolation from public scripts;
     depends on what Lovable hosting allows (not verified).
  2. Server-held session: sign-in handled by a server function that stores the refresh token in
     an httpOnly, `SameSite=Strict`, `Path=/admin` cookie; the browser never holds a token.
  3. Generated localStorage session on the shared origin — acceptable only if the public site
     loads no third-party scripts; today it does.
- Sign-out clears the session server- and client-side and returns to `/admin/login`.

## 4. Authorization boundary

```
browser (Admin UI)
   │  server fn call + session
   ▼
admin.functions.ts  ── requireAdmin middleware:
   │                    1. verify Supabase JWT (getClaims) → user id   else UNAUTHENTICATED
   │                    2. builder_admin_is_active(user id)             else FORBIDDEN
   │                    3. context.actor = user id  (never from the body)
   ▼
admin.server.ts  ── zod-parse filters/ids → supabaseAdmin.rpc("builder_admin_*")
   ▼
database  ── service_role only; builder_admin_set_status re-checks the allowlist
```

- One middleware for every Admin function; no Admin function exists without it (a check in
  the Admin test suite enumerates exported Admin functions and asserts the middleware).
- The actor for audited writes comes only from the verified session.
- Defence in depth: RLS on with no policies and no public grants on every table, so a leaked
  publishable key or a misrouted browser query reads nothing.
- **Public Builder isolation:** Builder server functions call only the Builder's `builder_*`
  functions, never `builder_admin_*`; its snapshot excludes status, contact and notification
  fields (tested). Admin modules live in `src/lib/admin/` and are never imported by
  `src/lib/builder/` or `src/components/builder/`. The production client bundle is scanned for
  `builder_admin_` and Admin prompts/fields as part of the Admin build checks.

## 5. Server / client data boundary

- The browser gets JSON from Admin server functions only. No Supabase table access from the
  browser (it would be refused anyway).
- Specs from Admin responses are re-validated (`parseDraft` → `toSpec`) before
  `ConceptRenderer` — the renderer is the Builder's, reused unchanged.
- `ssr: false` on Admin routes: no lead data is rendered into HTML, cached, or streamed during
  SSR; data loads after the auth gate resolves.
- Responses carry `Cache-Control: no-store`. URLs carry lead UUIDs and filter values, never
  contact details; search text lives in the URL only because analytics is off on Admin (§6).
- Server logs contain codes and lead ids, never contact fields or brief text.

## 6. Isolation from the public shell and analytics

`SiteShell` gets an `isAdmin = pathname.startsWith("/admin")` branch that:

- renders no `Nav`, `Footer`, `FloatingCta`, `ContactWidget`, `ExitIntentModal`,
  `CookieBanner` (Admin has its own shell);
- skips `initAnalytics()` and `trackPageView()` for Admin paths;
- because a visitor who consented on the public site may already have Clarity loaded in the
  same tab, entering Admin is a full document load (the login page links with a plain `<a>`,
  and the Admin root is additionally wrapped in `data-clarity-mask="true"`).

## 7. Views, states and interactions

### Dashboard `/admin`

Blocks: submitted leads by status (seven counts, each a link to the filtered list), leads by
lifecycle, recent submissions, notification problems (failed / stale pending, linked),
recent concepts (thumbnails of current spec), recent activity.

- Loading: block-shaped skeletons, no spinners over the whole page.
- Empty (no submissions yet): says so plainly and shows how many drafts exist; no demo data.
- Error: per-block error with retry; a failed block never shows zeros that look like data.

### Leads `/admin/leads`

- Filters in URL search params, validated with `validateSearch` (zod): `status`, `lifecycle`
  (default `submitted`), `projectType`, `notification`, `q`. Invalid params are dropped with a
  notice, not silently coerced.
- Search: debounced 300 ms, ≤100 characters, literal.
- Pagination: keyset; "Next" uses `nextCursor`, "Previous" uses a cursor stack kept in memory
  (page 1 is the reset); total shown as "N leads".
- Columns: company, project type, status, budget, deadline, submitted, Telegram, contact.
- Empty: distinguishes "no leads yet" from "no leads match these filters" (with "clear filters").
- Error: table replaced by an error state with retry; filters kept.

### Lead detail `/admin/leads/$leadId`

Sections: header (company, project type, lifecycle, submitted time, **status control**),
contact + budget + deadline, brief (offering, audience, goal, visual preferences, references as
links with `rel="noopener noreferrer"`), selected concept (rendered preview, desktop/phone,
original ↔ current, revision timeline with feedback), other generations (collapsed, marked
superseded), Telegram delivery (status, attempts, last attempt), status history with actor
emails, activity timeline.

- Status change: a select plus optional note, **not optimistic** — pending state on the
  control, success replaces the whole detail with the function's returned lead, failure keeps
  the previous status with the error beside the control.
- Not found: Admin-internal not-found state with a link back to the list.
- Unsubmitted lead (reachable from the list with `lifecycle` filter): read-only banner "the
  visitor has not submitted this yet"; status control hidden.

### Concepts `/admin/concepts`

Grid of current concepts (toggle: include superseded; only selected), each a scaled
`ConceptRenderer` thumbnail linking to its lead. Keyset pagination with "Load more".

### Settings `/admin/settings`

Read-only: which server integrations are configured (booleans only — Anthropic key,
Telegram, service role), configured model name, Admin users (email, added, revoked). No secret
value, prefix or length is ever returned. Admin user management stays in SQL until a reviewed
write path exists.

## 8. Audit and activity history

- Status changes: `builder_status_events` with `changed_by` (Admin user id) and note.
- Activity: derived per `docs/admin/DATA_CONTRACT.md` §7 — it reports only what is recorded.
- Not in this phase: Admin notes, a view log ("who opened this lead"), notification resend.
  Each is a schema addition with its own audit rule, not a UI-only feature.

## 9. Files (when built)

```
src/routes/admin_.login.tsx, admin.tsx, admin.index.tsx, admin.leads.index.tsx,
           admin.leads.$leadId.tsx, admin.concepts.tsx, admin.settings.tsx
src/components/admin/                 shell, tables, filters, status control, timelines
src/lib/admin/admin.functions.ts      server functions (requireAdmin on every one)
src/lib/admin/admin.server.ts         typed builder_admin_* calls, error mapping
src/lib/admin/require-admin.ts        middleware: session → allowlist → actor
supabase/migrations/<ts>_admin_read_model.sql   promoted from docs/admin/admin-read-model.draft.sql
scripts/check-admin-contract.ts       (exists) read model against the Builder migration
```

## 10. Tests to add with the implementation

- Contract: already `scripts/check-admin-contract.ts` (9 checks).
- Server: every Admin function refuses without a session, refuses a non-admin, refuses a
  revoked admin, and takes the actor from the session even when the body names another.
- Builder isolation: no `builder_admin_` string in the client bundle; Builder server functions
  still pass their suite; the Builder snapshot still has no status/contact fields.
- Browser: dashboard, list (filter, search, paginate), detail, status change, empty and error
  states at 1440 and 390; no analytics requests on Admin paths; 0 console errors.

## 11. Owner decisions needed before building

1. Session model: separate origin, server-held httpOnly session, or accept localStorage (§3).
2. Sign-in method (password or magic link) and disabling public sign-ups in Supabase Auth.
3. Who the first Admin users are (rows in `admin_users`).
4. Admin UI language (internal tool — Czech only is the simplest honest choice).
5. Draft retention (what `builder_purge_stale_drafts` should cover, and how often).
