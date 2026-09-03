window.STATE =
{
  "slug": "cinematic-foundation",
  "title": "ELEVATE — единая кинематографическаяархитектура главной: мастер-таймлайн скролла, камера, токены движения",
  "mode": "semi",
  "depth": "deep",
  "polish": null,
  "tier": "T2",
  "briefFile": "2026-09-03-brief.md",
  "memoryFile": "CLAUDE.md",
  "skillDir": "/Users/danastabilnost/Desktop/Elevate Digital Studio/.agents/skills/autopilot",
  "startedAt": "2026-09-03T07:48:00+02:00",
  "updatedAt": "2026-09-03T08:07:19+02:00",
  "finishedAt": null,
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-09-03T07:48:00+02:00",
      "note": "аудит: git, архитектура главной, PRODUCT.md, восемь референсов просмотрены, скриншоты десктоп+мобильный сняты",
      "finishedAt": "2026-09-03T07:52:00+02:00"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-09-03T07:52:00+02:00",
      "finishedAt": "2026-09-03T07:58:00+02:00"
    },
    {
      "id": "briefing",
      "status": "skipped",
      "note": "полуавтомат: развилок, требующих пользователя, нет — визуальное направление уже выбрано (ADR 0011/0012), генерация ассетов в этом прогоне не запускается"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-09-03T07:58:00+02:00",
      "finishedAt": "2026-09-03T08:05:00+02:00"
    },
    {
      "id": "plan",
      "status": "done",
      "startedAt": "2026-09-03T08:05:00+02:00",
      "finishedAt": "2026-09-03T07:59:27+02:00",
      "note": "T2, 3 таска, 3 волны по одному — каждый следующий действительно блокируется предыдущим"
    },
    {
      "id": "build",
      "status": "active",
      "startedAt": "2026-09-03T07:59:27+02:00"
    },
    {
      "id": "review",
      "status": "pending"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 57,
    "done": 14,
    "inTicket": 8,
    "inSpec": 35,
    "placeholder": 0,
    "deferred": 0,
    "dropped": 0
  },
  "tickets": [
    {
      "id": "01",
      "title": "Кинематографический фундамент: один таймлайн, одна камера, один гейт",
      "requirements": [
        "R20",
        "R21",
        "R22",
        "R20.1",
        "R20.2",
        "R22.1"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "src/components/cinematic/",
        "src/routes/__root.tsx"
      ],
      "status": "done",
      "retries": 0,
      "repairs": 1,
      "handoffs": 0,
      "startedAt": "2026-09-03T08:10:00+02:00",
      "finishedAt": "2026-09-03T08:07:19+02:00",
      "tests": "tsc чисто; eslint 0 errors; vite build OK; CDP-кадры p=0 и p=0.4 сверены с baseline — идентичны",
      "commit": "633c9d4",
      "note": "1 круг правок: семантика гейта — слабая машина не должна падать в still, только терять клип"
    },
    {
      "id": "02",
      "title": "Hero на мастер-таймлайне + мёртвая полоса скролла",
      "requirements": [
        "R11",
        "R11.1",
        "R15",
        "R16",
        "R16.1",
        "R24"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "src/components/home/HeroScene.tsx",
        "HeroCameraPlate.tsx",
        "HeroLightField.tsx"
      ],
      "status": "in-progress",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0,
      "startedAt": "2026-09-03T08:07:19+02:00"
    },
    {
      "id": "03",
      "title": "Услуги на таймлайне, вычисленный стык, единый гейт секций",
      "requirements": [
        "R12",
        "R13",
        "R16.2",
        "R20.1",
        "R20.2",
        "R22.1"
      ],
      "blockedBy": [
        "02"
      ],
      "wave": 3,
      "zone": [
        "src/components/home/ServicesShowcase.tsx",
        "StudioManifesto.tsx",
        "CaseShowcase.tsx",
        "ClosingCta.tsx"
      ],
      "status": "pending",
      "retries": 0,
      "repairs": 0,
      "handoffs": 0
    }
  ],
  "singlePass": null,
  "tests": null,
  "debt": {
    "placeholders": [],
    "assumptions": [],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": null,
  "concerns": [
    {
      "source": "визуальный аудит (preflight)",
      "file": "src/components/home/HeroScene.tsx",
      "finding": "мёртвая полоса скролла: между ~5% и ~20% прокрутки страницы кадр не содержит ни одной строки текста (~2 вьюпорта). Измерено кадрами desk-p07 и desk-p14 на 1440x900.",
      "blocking": true,
      "resolution": "таск 02"
    },
    {
      "source": "визуальный аудит (preflight)",
      "file": "src/components/home/ServicesShowcase.tsx",
      "finding": "стык hero → services виден: жёсткая горизонтальная кромка на ~47% высоты вьюпорта и ~425px пустоты над ней (кадр desk-p22). Перекрытие подобрано константой lg:-mt-[42vh] под одну высоту экрана.",
      "blocking": true,
      "resolution": "таск 03"
    },
    {
      "source": "визуальный аудит (preflight)",
      "file": "src/components/Nav.tsx, cookie-баннер, плавающий CTA",
      "finding": "хром страницы перекрывает композицию на каждой позиции скролла; на мобильном баннер срезает нижнюю треть телефона — ровно тот кадр, ради которого сделан мобильный hero. Nav при скролле становится непрозрачной полосой с жёстким швом.",
      "blocking": false,
      "resolution": "отдельная фаза карты сборки; в этом прогоне не трогается (R34)"
    },
    {
      "source": "аудит референсов",
      "file": "src/assets/refs/svc-*.jpg vs hero-macbook.jpg",
      "finding": "два визуальных языка на одной странице: фотореалистичный кинематографический hero и Pixar-подобный маскот в услугах.",
      "blocking": false,
      "resolution": "закрыто решением пользователя — ADR 0011; не переоткрывается"
    }
  ],
  "reviewers": {
    "manifestSpec": null,
    "craft": null
  },
  "blind": null
}
