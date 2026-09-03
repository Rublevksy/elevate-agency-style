# Границы — cinematic-foundation

Что один таск обещает следующему. Засеяно из спецификации; растёт по мере того,
как таски закрываются.

---

## Из существующего кода (не меняется этим прогоном)

### `SceneImage` — `src/components/media/SceneImage.tsx`

```ts
type SceneName =
  | "hero-macbook" | "hero-iphone" | "hero-light" | "hero-atmo"
  | "svc-web" | "svc-eshop" | "svc-app" | "svc-seo" | "svc-branding";

interface SceneImageProps {
  name: SceneName;
  alt: string;               // плиты не несут вшитого текста — описывай сцену
  className?: string;        // на <picture>
  imgClassName?: string;     // на <img>; потребитель ОБЯЗАН задать размерные классы
  priority?: boolean;        // eager + fetchpriority=high
  sizes?: string;
  style?: React.CSSProperties;
}
```

Единственная точка подключения сценической графики. Натуральные размеры зашиты —
CLS нет. Не рендерить постер из `/references/` напрямую ни при каких условиях.

### `HeroCameraPlate` — `src/components/home/HeroCameraPlate.tsx`

```ts
interface HeroCameraPlateProps {
  progress: MotionValue<number>;  // часы закреплённой стадии hero, 0…1
  reduced: boolean;
  cinematic: boolean;             // нести ли съёмку на этом вьюпорте
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}
```

Несущие константы — **не менять без перегенерации ассетов**:
`CLIP_RANGE = 0.38` (шот B сгенерирован из кадра шота A ровно в этой точке),
`SHOT_SPLIT = 0.55`, `JOIN = 0.02`, `HANDOFF = [0.05, 0.17]`, `MATCH_SCALE = 1.085`.

### `HeroLightField` — `src/components/home/HeroLightField.tsx`

```ts
interface HeroLightFieldProps {
  progress: MotionValue<number>;
  reduced: boolean;
  layer: "back" | "front";
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}
```

Всё аддитивно (`mix-blend-screen`) — в нижней точке цикла кадр равен утверждённому.

### i18n

`useT()` → `t.ui.serviceStage: Array<{ title: string; tag: string }>` — пять услуг,
порядок фиксирован: 01 Web · 02 SEO · 03 E-shop · 04 Značka · 05 Aplikace. Есть на
всех четырёх языках. `t.hero.*` — копия первого экрана. **Новые ключи заводятся
сразу для CZ/EN/RU/UA или не заводятся вовсе.**

---

## Обещает таск 01 → потребляют 02 и 03

Модуль `@/components/cinematic` (барель `src/components/cinematic/index.ts`).

```ts
// motion-tokens.ts
export const EASE: readonly [number, number, number, number];  // [0.22, 1, 0.36, 1]
export const BEAT: { scene; kicker; headline; headlineStep; support; supportStep };
export const PERSPECTIVE: number;                               // 1400
export const Z_ATMO: number;        // -900
export const Z_LIGHT_BACK: number;  // -560
export const Z_PLATE: number;       // -250
export const Z_LIGHT_FRONT: number; // -60
export function depth(z: number): React.CSSProperties;

// useMotionCapability.ts
export type MotionCapability = "still" | "motion" | "cinematic";
export function useMotionCapability(): MotionCapability;
export function useReducedScene(): boolean;    // cap === "still"
export function useCinematicScene(): boolean;  // cap === "cinematic"

// CinematicStage.tsx
export function CinematicStage(props: { children: React.ReactNode }): JSX.Element;
export function useStageAct(id: string): { viewports: number; pin: number } | undefined;

// useAct.ts
export interface ActOptions { viewports: number; pin: number }
export interface Act {
  ref: React.RefObject<HTMLElement>;
  progress: MotionValue<number>;  // 0…1 внутри закреплённого окна = сегодняшнее `p`
  enter: MotionValue<number>;     // подъезд акта
  exit: MotionValue<number>;      // уезд стадии
  raw: MotionValue<number>;       // сырой прогресс по секции
  viewports: number;
  pin: number;
}
export function useAct(id: string, options: ActOptions): Act;
```

**Инварианты, на которые опираются 02 и 03:**

- `act.progress` численно равен сегодняшнему `p` в `HeroScene` при
  `{ viewports: 3, pin: 2/3 }` — перевод не должен сдвинуть ни один бит шот-листа.
- `useAct` не держит состояния: всё — чистые `useTransform` от одного `MotionValue`.
  Обратный скролл проигрывает таймлайн назад по построению (R21).
- `useMotionCapability()` до монтирования отдаёт `"still"` (у сервера нет вьюпорта).
- `CinematicStage` не задаёт высоты секциям. Секция остаётся владельцем вёрстки;
  реестр нужен, чтобы сосед мог спросить о соседе.

## Обещает таск 02 → потребляет 03

- Акт `"hero"` зарегистрирован с `{ viewports, pin }`; фактические значения
  записываются сюда таском 02, потому что таск 03 вычисляет из них перекрытие.
- `useCinematicViewport.ts` остаётся на диске, но больше не импортируется.

## Обещает таск 03

- Во всей `src/components/home/` нет прямых `useScroll`, локальных `EASE`,
  вызовов `useReducedMotion`.
- Перекрытие hero → services — функция реестра актов, а не константа в `vh`.

---

## Инструменты прогона

`/.autopilot/cinematic-foundation/shot.mjs` — CDP-драйвер съёмки:

```
node .autopilot/cinematic-foundation/shot.mjs <url> <outdir> <label> <W> <H> <доли,через,запятую> [reduced]
```

`ws` резолвится по абсолютному пути в `node_modules` проекта. Базовые кадры «как
было» — `screenshots/baseline/`.

**Ловушки съёмки (проверено на этой машине):**
- `google-chrome --headless --screenshot` для узких ширин ненадёжен — только CDP;
- `captureBeyondViewport: true` не триггерит lazy-загрузку и даёт ложные пустые
  секции — нужен реальный `window.scrollTo` + пауза;
- `--virtual-time-budget` замораживает декодирование видео — кадр выходит пустым;
- `ffmpeg`/`ffprobe` на машине нет.
