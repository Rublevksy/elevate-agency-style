window.STATE =
{
  "slug": "reference-led-directions",
  "title": "ELEVATE — перестройка V1–V4 на реальной референс-графике (маскот, scroll storytelling, WOW)",
  "mode": "semi",
  "depth": "normal",
  "polish": null,
  "tier": "T2",
  "briefFile": "2026-08-18-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/danastabilnost/Desktop/Elevate Digital Studio/.claude/skills/autopilot",
  "startedAt": "2026-08-18T20:54:44+02:00",
  "updatedAt": "2026-08-18T20:54:44+02:00",
  "finishedAt": "2026-08-18T21:45:00+02:00",
  "stages": [
    { "id": "preflight", "status": "done", "startedAt": "2026-08-18T20:23:00+02:00", "finishedAt": "2026-08-18T20:40:00+02:00", "note": "аудит + карта референсов показаны пользователю" },
    { "id": "manifest",  "status": "done", "startedAt": "2026-08-18T20:40:00+02:00", "finishedAt": "2026-08-18T20:54:00+02:00" },
    { "id": "briefing",  "status": "done", "startedAt": "2026-08-18T20:44:00+02:00", "finishedAt": "2026-08-18T20:47:00+02:00", "note": "3 вопроса заданы и отвечены: маскот везде включая главную; гибрид фото+живой UI; перестроить все четыре заново" },
    { "id": "spec",      "status": "done", "startedAt": "2026-08-18T20:54:44+02:00", "finishedAt": "2026-08-18T21:00:00+02:00" },
    { "id": "plan",      "status": "done", "startedAt": "2026-08-18T21:00:00+02:00", "finishedAt": "2026-08-18T21:02:00+02:00", "note": "T2, 5 тасков, 2 волны (01 → 02+03+04+05)" },
    { "id": "build",     "status": "done", "startedAt": "2026-08-18T21:02:00+02:00", "finishedAt": "2026-08-18T21:40:00+02:00" },
    { "id": "review",    "status": "done", "startedAt": "2026-08-18T21:08:00+02:00", "finishedAt": "2026-08-18T21:40:00+02:00", "note": "визуальное ревью по реальным скриншотам каждого направления; 5 находок, все починены и переподтверждены" },
    { "id": "final",     "status": "done", "startedAt": "2026-08-18T21:40:00+02:00", "finishedAt": "2026-08-18T21:45:00+02:00" }
  ],
  "requirements": {
    "total": 52, "done": 48, "inTicket": 0, "inSpec": 3,
    "placeholder": 1, "deferred": 0, "dropped": 0
  },
  "tickets": [
    { "id": "01", "title": "RefImage: общий слой подачи референс-графики", "requirements": ["R23","R32","R47i","R48i","G02"], "blockedBy": [], "wave": 1, "zone": ["src/components/design-explore/RefImage.tsx","concepts.ts"], "status": "done", "startedAt": "2026-08-18T21:02:00+02:00", "finishedAt": "2026-08-18T21:04:00+02:00", "tests": "tsc clean", "commit": "eff0d9c", "retries": 0, "repairs": 0, "handoffs": 0 },
    { "id": "02", "title": "/design-v1 — Референс оживший", "requirements": ["R19-R36","G01","G02"], "blockedBy": ["01"], "wave": 2, "zone": ["src/routes/design-v1.tsx"], "status": "done", "startedAt": "2026-08-18T21:04:00+02:00", "finishedAt": "2026-08-18T21:14:00+02:00", "tests": "tsc clean; eslint clean; скриншоты десктоп+мобильный просмотрены", "commit": "a977823", "retries": 0, "repairs": 1, "handoffs": 0 },
    { "id": "03", "title": "/design-v2 — Кинематографические главы", "requirements": ["R19-R36","G01","G02"], "blockedBy": ["01"], "wave": 2, "zone": ["src/routes/design-v2.tsx"], "status": "done", "startedAt": "2026-08-18T21:04:00+02:00", "finishedAt": "2026-08-18T21:08:00+02:00", "tests": "tsc clean; vite build OK", "commit": "41305cf", "retries": 0, "repairs": 3, "handoffs": 0, "note": "3 круга правок: коллизия заголовка с гравировкой → перезум (регрессия) → найдена середина; отдельно мобильное кадрирование" },
    { "id": "04", "title": "/design-v3 — Стол студии", "requirements": ["R19-R36","G01","G02"], "blockedBy": ["01"], "wave": 2, "zone": ["src/routes/design-v3.tsx"], "status": "done", "startedAt": "2026-08-18T21:04:00+02:00", "finishedAt": "2026-08-18T21:08:00+02:00", "tests": "tsc clean; eslint clean", "commit": "41305cf", "retries": 0, "repairs": 1, "handoffs": 0 },
    { "id": "05", "title": "/design-v4 — Аппаратная", "requirements": ["R19-R36","G01","G02"], "blockedBy": ["01"], "wave": 2, "zone": ["src/routes/design-v4.tsx"], "status": "done", "startedAt": "2026-08-18T21:06:00+02:00", "finishedAt": "2026-08-18T21:10:00+02:00", "tests": "tsc clean", "commit": "41305cf", "retries": 0, "repairs": 1, "handoffs": 0 }
  ],
  "singlePass": null,
  "tests": null,
  "debt": { "placeholders": [], "assumptions": [], "emptyEnv": [] },
  "additions": [],
  "coverage": null,
  "concerns": [
    { "source": "аудит референсов (preflight)", "file": "src/assets/hero/macbook-photo.jpg", "finding": "предыдущий ассет содержал ВЕСЬ референс с вшитым чешским текстом — из-за этого на /design-v1 дублировался заголовок (page H1 + текст в растре). Ломает i18n (4 языка) и SEO. Заменён на чистые кропы без типографики в src/assets/refs/.", "blocking": true, "resolution": "fixed — новый пайплайн scripts/extract-ref-assets.mjs" },
    { "source": "аудит референсов (preflight)", "file": "references/*_SERVICE_*_HERO.png", "finding": "на экранах устройств внутри сервисных сцен вшиты ВЫДУМАННЫЕ метрики: +220%/+180%/+150% (SEO), +2 482 users/+18,6% (App), «PREMIUM KOLEKCE 2 499 Kč» (E-shop). PRODUCT.md принцип 5 запрещает выдуманные метрики. Кропы перекадрированы на маскота, чтобы цифры не читались как заявления страницы.", "blocking": false, "resolution": "смягчено кадрированием; остаток — в отчёт как «заменить реальными данными перед продакшеном»" },
    { "source": "аудит референсов (preflight)", "file": "src/assets/refs/svc-eshop.*", "finding": "в сцене e-shop виден логотип Nike (чужой товарный знак) и вымышленный магазин «ICONIC» на экране ноутбука.", "blocking": false, "resolution": "в отчёт — решение о правовой стороне за пользователем" }
  ],
  "qaFindings": [
    { "route": "/design-v2", "finding": "заголовок наезжает на гравировку ELEVATE на крышке макбука; скрим под текстом слабоват — текст лежит прямо на светлой части фото", "severity": "composition", "status": "open" },
    { "route": "/design-v3", "finding": "внутри живого browser-window пустые серые прямоугольники-плейсхолдеры (craft-floor: «soft-shadowed rounded rectangles standing in for content») и пустая нижняя половина окна", "severity": "craft", "status": "open" },
    { "route": "/design-v4", "finding": "разметка села на кромки точно (проверено скриншотом), но подписи налезают: «MARK / OK» на гравировку ELEVATE, «HINGE 128°» на собственную выносную линию", "severity": "polish", "status": "open" }
  ],
  "reviewers": { "manifestSpec": null, "craft": null },
  "blind": null
}
