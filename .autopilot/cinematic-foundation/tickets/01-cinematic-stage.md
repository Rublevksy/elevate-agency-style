# 01 — Кинематографический фундамент: один таймлайн, одна камера, один гейт

**Зона:** `src/components/cinematic/` (новая директория) · `src/routes/__root.tsx` (только монтирование провайдера)
**Блокируется:** ничем · **Волна:** 1
**Требования:** R20, R21, R22, R20.1, R20.2, R22.1

## Зачем

Сейчас позицию скролла на главной читают **пять независимых систем**, а решение
«сколько движения тянет эта машина» принимается в **шести** местах с разными
ответами. Из-за этого передача кадра между секциями настраивается магическими
числами (`lg:-mt-[42vh]`, `PIN_FRACTION`, `[0, 0.55, 1]`), а константы камеры
(`PERSPECTIVE`, `depth()`, Z-плоскости) заперты внутри `HeroScene` — то есть
«одна камера на страницу» физически невозможна. Каждая следующая фаза карты
сборки (hero → fullscreen, services world, cases) добавляла бы шестую, седьмую
систему. Этот таск делает источник один.

**Этот таск не меняет ни одного видимого пикселя.** Он только создаёт примитивы и
монтирует провайдер. Перевод секций — таски 02 и 03.

## Что построить

Новая директория `src/components/cinematic/`.

### `motion-tokens.ts`

Единственный дом для того, что сейчас скопировано:

- `EASE` — `[0.22, 1, 0.36, 1] as const`. Ровно эта кривая уже объявлена заново в
  `HeroScene.tsx`, `ServicesShowcase.tsx`, `StudioManifesto.tsx`, `CaseShowcase.tsx`,
  `ClosingCta.tsx`. Соглашение проекта — **альтернативных кривых не вводить**
  (см. комментарий в `src/styles.css` рядом с `.hover-lift`).
- `BEAT` — биты арриваля в секундах, сейчас локальные в `HeroScene`
  (`scene`, `kicker`, `headline`, `headlineStep`, `support`, `supportStep`).
- Камера: `PERSPECTIVE`, `Z_ATMO`, `Z_LIGHT_BACK`, `Z_PLATE`, `Z_LIGHT_FRONT`,
  и функция `depth(z)`. Скопировать **дословно** из `HeroScene.tsx` вместе с
  комментарием, объясняющим предкомпенсацию проекции `scale((P − z) / P)` — это
  знание дороже самих чисел.

### `useMotionCapability.ts`

```ts
export type MotionCapability = "still" | "motion" | "cinematic";
export function useMotionCapability(): MotionCapability;
```

- `still` — `prefers-reduced-motion: reduce`, **или** машина не проходит проверку
  из текущего `useCinematicViewport.ts` (`saveData`, `deviceMemory < 4`,
  `hardwareConcurrency < 4`).
- `cinematic` — не `still`, и `(min-width: 1024px) and (pointer: fine)`.
- `motion` — всё остальное.

Логика отбора машин переносится **как есть** из
`src/components/home/useCinematicViewport.ts` вместе с её комментариями: там
объяснено, почему отсутствие Device Memory API трактуется как «способна» (частый
случай — Safari на Mac). Стартовое значение до монтирования — `"still"`, по той же
причине, что и сейчас: у сервера нет вьюпорта.

Отдай ещё два производных хелпера, чтобы вызывающим не писать сравнения строк:
`const reduced = cap === "still"` встречается в каждом компоненте.

```ts
export function useReducedScene(): boolean;   // cap === "still"
export function useCinematicScene(): boolean; // cap === "cinematic"
```

**`src/components/home/useCinematicViewport.ts` не удалять** (R30) — оставить файл
на месте; таск 02 перестанет его импортировать.

### `CinematicStage.tsx`

Провайдер. Один `useScroll` на страницу и реестр актов.

```tsx
export function CinematicStage({ children }: { children: React.ReactNode }): JSX.Element;
```

Ответственность:

- владеет **единственным** `useScroll()` документа (без `target`, то есть прогресс
  всей страницы);
- держит реестр актов: `id → { viewports, pin, order }`, заполняемый через
  `useAct` при монтировании;
- отдаёт через контекст: `scrollY`, `capability`, `registerAct`, `getAct`.

Провайдер **не** задаёт высоты секциям — секции остаются владельцами своей вёрстки.
Реестр нужен для другого: чтобы акт мог спросить о **соседе** (`getAct("hero")` из
услуг) и вычислить перекрытие, а не подобрать его числом. Это то, ради чего таск 03
существует.

Провайдер монтируется в `src/routes/__root.tsx` **внутри** существующего `SiteShell`,
обёрткой вокруг `<Outlet />`, и не должен ломать ни один другой маршрут: акты
регистрируются только там, где вызван `useAct`, а на страницах без актов реестр
просто пуст. Ничего в `__root.tsx` не удалять и не переставлять — только обернуть.

### `useAct.ts`

```ts
export interface ActOptions {
  /** Сколько экранов скролла занимает акт целиком. */
  viewports: number;
  /** Доля длины акта, на которой его сцена закреплена (sticky). */
  pin: number;
}
export interface Act {
  ref: React.RefObject<HTMLElement>;
  /** Часы шот-листа: 0 в начале закреплённого окна → 1 в его конце. */
  progress: MotionValue<number>;
  /** Подъезд акта: 0 когда его верх у нижней кромки экрана → 1 когда он закреплён. */
  enter: MotionValue<number>;
  /** Уход акта: 0 пока сцена держится → 1 когда акт уехал вверх. */
  exit: MotionValue<number>;
  /** Сырой прогресс по секции, для случаев, где нужен именно он. */
  raw: MotionValue<number>;
  viewports: number;
  pin: number;
}
export function useAct(id: string, options: ActOptions): Act;
```

Механика:

- внутри — `useScroll({ target: ref, offset: ["start start", "end start"] })` для
  `raw` и `useScroll({ target: ref, offset: ["start end", "start start"] })` для
  `enter`. Это ровно те два чтения, которые сегодня руками написаны в `HeroScene`
  и `ServicesShowcase`; вся разница в том, что теперь они объявлены один раз и
  секции их не пишут;
- `progress = useTransform(raw, [0, pin], [0, 1])` — то самое `p`, по которому
  сейчас режется шот-лист hero. Это **несущее**: закреплённая стадия занимает
  первые `pin` длины трека, поэтому хореография не разъезжается при изменении
  высоты секции. Перенести комментарий из `HeroScene` дословно;
- `exit = useTransform(raw, [pin, 1], [0, 1])`;
- при монтировании — `registerAct(id, { viewports, pin, order })`, при размонтировании
  снять регистрацию.

**Обратимость (R21).** Всё выражено через `useTransform` от одного `MotionValue`,
то есть как чистая функция позиции скролла — обратный скролл проходит тот же
таймлайн назад по построению, а не по настройке. В этом файле **не должно быть**
ни `useState`, ни `useMotionValueEvent`, ни `useSpring` на самом прогрессе:
любое из них вводит состояние и ломает обратимость.

### `index.ts`

Барель: `CinematicStage`, `useAct`, `useMotionCapability`, `useReducedScene`,
`useCinematicScene`, `EASE`, `BEAT`, `depth`, `PERSPECTIVE`, `Z_*`.

## Критерии приёмки

1. `src/components/cinematic/` содержит пять файлов выше; каждый экспорт
   типизирован, без `any`.
2. `CinematicStage` смонтирован в `__root.tsx`; ни одна существующая строка
   `__root.tsx` не удалена и не переставлена — только добавлена обёртка.
3. `useAct` не содержит `useState`, `useMotionValueEvent`, `useSpring` на прогрессе.
4. `useCinematicViewport.ts` и все существующие компоненты **не изменены** — этот
   таск ничего не переводит.
5. `node_modules/.bin/tsc --noEmit` — чисто.
6. `node_modules/.bin/eslint src/components/cinematic src/routes/__root.tsx` —
   без **новых** ошибок помимо предсуществующих `prettier/prettier`.
7. `node_modules/.bin/vite build` — успешно.
8. **Скриншот-доказательство отсутствия регрессии:** CDP-кадры главной на 1440x900
   в позициях 0 и 0.4 визуально идентичны кадрам до таска. Драйвер съёмки —
   в `.autopilot/cinematic-foundation/shot.mjs`.

## Чего не делать

- Не переводить ни одну секцию на новые примитивы (это таски 02/03).
- Не трогать `src/components/hero/` (мёртвый код по ADR 0003).
- Не чинить предсуществующие `prettier/prettier`.
- Не удалять ни одного файла.
