window.STATE =
{
  "slug": "elevate-cinematic-redesign",
  "title": "ELEVATE — cinematic premium redesign (hero/scroll/services + site)",
  "mode": "full",
  "depth": "normal",
  "polish": null,
  "tier": null,
  "briefFile": "2026-08-18-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/danastabilnost/Desktop/Elevate Digital Studio/.claude/skills/autopilot",
  "startedAt": "2026-08-18T11:07:51+02:00",
  "updatedAt": "2026-08-18T11:50:30+02:00",
  "finishedAt": null,
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-18T11:07:51+02:00", "finishedAt": "2026-08-18T11:09:30+02:00" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-18T11:09:30+02:00", "finishedAt": "2026-08-18T11:31:02+02:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-08-18T11:31:02+02:00", "finishedAt": "2026-08-18T11:31:02+02:00" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-18T11:31:02+02:00", "finishedAt": "2026-08-18T11:41:32+02:00" },
    { "id": "plan",      "status": "done", "startedAt": "2026-08-18T11:41:32+02:00", "finishedAt": "2026-08-18T11:50:30+02:00" },
    { "id": "build",     "status": "active", "startedAt": "2026-08-18T11:50:30+02:00" },
    { "id": "review",    "status": "pending" },
    { "id": "final",     "status": "pending" }
  ],
  "requirements": {
    "total": 146, "done": 0, "inTicket": 144, "inSpec": 0,
    "placeholder": 1, "deferred": 1, "dropped": 0
  },
  "coverage": { "findings": 9, "actedOn": 9, "note": "G2 independent pass: PRODUCT.md ref, design tokens (R141-149), files-not-to-touch, homepage order, trust no-fabrication, nav, performance detail all added to spec; 3 spec-not-in-brief items (no Three.js, no new test runner, retire hero-mockup.jpg) kept as justified engineering decisions." },
  "tier": "T2",
  "tickets": [
    { "id": "01", "title": "Дизайн-токены, общие примитивы, новые i18n-строки", "requirements": ["R01","R04","R21","R22","R70","R120","R141","R142","R143","R144","R145","R146","R147","R148","R149"], "blockedBy": [], "wave": 1, "zone": ["src/styles.css","src/components/sections/SectionHeading.tsx","src/components/Nav.tsx","src/lib/i18n.ts"], "status": "in-progress", "startedAt": "2026-08-18T11:51:32+02:00", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "02", "title": "DeviceHero: hero + scroll-сцена (MacBook/iPhone)", "requirements": ["R02","R03","R23-R41","R76","R77","R79","R133i"], "blockedBy": ["01"], "wave": 2, "zone": ["src/components/hero/"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "03", "title": "ServiceStage: связанная подача 5 услуг", "requirements": ["R02","R03","R42-R58","R131i","R132i","R134i"], "blockedBy": ["01"], "wave": 2, "zone": ["src/components/sections/ServiceStage.tsx"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "05", "title": "CTA-анкета: новый шаг в Contact.tsx", "requirements": ["R63-R69","R66.1","R94","R96","R136i","R139"], "blockedBy": ["01"], "wave": 2, "zone": ["src/components/sections/Contact.tsx"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "06", "title": "Роллаут визуальной системы на остальные страницы", "requirements": ["R109","R118","R137-R140"], "blockedBy": ["01"], "wave": 2, "zone": ["src/routes/about.tsx","src/routes/services*.tsx","src/routes/pricing*.tsx","src/routes/projects*.tsx","src/routes/audit.tsx","src/routes/insights*.tsx"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "04", "title": "Сборка homepage на новых компонентах", "requirements": ["R08","R09","R19","R42","R59-R62","R101","R102","R129","R135i"], "blockedBy": ["02","03"], "wave": 3, "zone": ["src/routes/index.tsx"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "07", "title": "QA: сборка, регрессии, критерий премиальности", "requirements": ["R05-R125 (verification)"], "blockedBy": ["04","05","06"], "wave": 4, "zone": ["repo-wide verification"], "status": "pending", "retries": 0, "repairs": 0, "handoffs": 0 }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "concerns": [],
  "reviewers": { "manifestSpec": null, "craft": null },
  "blind": null
}
