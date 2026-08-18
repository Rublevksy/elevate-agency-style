<!-- autopilot:start -->
# ELEVATE Digital Studio

Marketing site for ELEVATE, a Prague-based digital studio (websites, e-shops, branding, app dev, SEO), for CZ/EN/RU/UA visitors.

## Команды

| Команда | Что делает |
|---------|------------|
| `bun install` | Установить зависимости |
| `bun run dev` | Запустить локально (vite dev) |
| `bun run build` | Собрать продакшен-билд |
| `bun run lint` | Прогнать eslint |
| `bunx tsc --noEmit` | Проверить типы (отдельного typecheck-скрипта нет) |

**Песочница без `bun`/`bunx`:** использовать бинарники напрямую — `node_modules/.bin/tsc`, `node_modules/.bin/eslint`, `node_modules/.bin/vite build`.

**`bun run lint` — тысячи `prettier/prettier`-предупреждений по всему репозиторию** — это существовавший до автопилот-редизайна технический долг форматирования, не регрессия. Не чинить его попутно в тикетах редизайна.

## Как здесь работает Autopilot

Сборка ведётся навыком `/autopilot`. Требования, спецификация и таски — в `.autopilot/`.
Прогресс — `.autopilot/dashboard.html`. Правило: требование из `manifest.md`
может снять только пользователь.

Если работа продолжается — скажи «продолжи автопилот»: состояние поднимется
из `.autopilot/state.js`, переспрашивать ничего не нужно.
<!-- autopilot:end -->
