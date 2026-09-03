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

---

## Из таска 01 — фундамент (построено, коммит `633c9d4`)

Модуль `@/components/cinematic`. Сигнатуры — как обещано выше, с четырьмя
уточнениями от реализации:

```ts
// ref типизирован под React 19: useRef<HTMLElement>(null) даёт именно этот тип
interface Act { ref: React.RefObject<HTMLElement | null>; /* остальное как обещано */ }

// реестр отдаёт порядок регистрации — таск 03 им не пользуется, но он есть
interface ActRecord { viewports: number; pin: number; order: number }
export function useStageAct(id: string): ActRecord | undefined;

// доступ к самой стадии
export function useStage(): CinematicStageValue;          // бросает вне провайдера
export function useOptionalStage(): CinematicStageValue | null;
export function useStageProgress(): MotionValue<number>;  // прогресс всей страницы
export function useDetectedCapability(): MotionCapability; // измерение без контекста
```

**Семантика гейта — исправлена относительно текста таска 01:**

| Уровень | Наступает | Что даёт |
|---|---|---|
| `still` | **только** `prefers-reduced-motion: reduce` | утверждённые статичные кадры |
| `motion` | всё остальное, **включая** слабую машину и `saveData` | риг, параллакс, вайпы; без видео |
| `cinematic` | не `still` И `isCapableDevice()` И `(min-width: 1024px) and (pointer: fine)` | плюс скраб двух клипов |

Явный запрет в шапке файла: не «оптимизировать» device-тест обратно в `still`.
Слабая машина теряет только съёмку — забирать у неё всю сцену значит забирать
сайт ради экономии, о которой посетитель не просил.

**Что нужно знать таскам 02 и 03:**

- `CinematicStage` смонтирован в `__root.tsx` внутри `<main>`, рендерит
  `display: contents` — бокса в вёрстке не появилось, ни один пиксель не сдвинут.
- Реестр актов живёт в `useRef` + явные подписчики, не в `useState`: регистрация
  из эффекта не перерисовывает страницу. Спрашивать соседа — через `useStageAct`.
- `useStage()` **бросает** вне провайдера. Это не ошибка проектирования: акт вне
  стадии — баг проводки, и сообщение говорит, где смонтирован провайдер.
- `useAct` не содержит состояния — проверено. Не добавлять его и потребителям
  внутрь самого прогресса; `useMotionValueEvent` у потребителя (как `active` в
  `ServicesShowcase`) допустим: это состояние-зеркало позиции, а не память.
- `useCinematicViewport.ts` на диске, не удалён, больше не нужен.

---

## Из таска 02 — hero на таймлайне (построено, коммит `7c7831e`)

**Регистрация акта, из которой таск 03 считает перекрытие:**

```ts
useAct("hero", { viewports: 3, pin: 2 / 3 })
```

То есть `useStageAct("hero")` отдаёт `{ viewports: 3, pin: 2/3, order: 0 }`.
Физический уезд стадии занимает `3 * (1 − 2/3) = 1` вьюпорт — это и есть та
величина, долей от которой должно быть перекрытие в таске 03, вместо `-mt-[42vh]`.

**Что теперь живёт в закреплённой стадии hero:**

- `p 0.00…0.27` — копия первого экрана, как раньше;
- `p 0.27…0.98` — титры проезда камеры: пять услуг из `t.ui.serviceStage`, по
  одной, в той же левой колонке. Границы окон сдвинуты относительно текста таска
  (было 0.30…0.94) по измерению: бессловесная полоса на 1440x900 — `p 0.24…0.96`,
  и литеральные числа таска оставляли дыру с обоих концов.
- Передача между титрами — **прокрутка сквозь маскированные воротца**, не
  кроссфейд: путь равен высоте воротцев, поэтому уходящий и приходящий строго
  дополняют друг друга и кадр никогда не бывает без слова. Кроссфейд был собран
  первым и отклонён по скриншоту.
- Слой `aria-hidden`: те же пять названий стоят ниже в `ServicesShowcase`
  полноценными ссылками, а смысл «по одному за раз» не переживает линеаризацию.
- При `still` слоя нет вовсе; утверждённый статичный кадр остаётся законченным.

**Что НЕ изменилось и на что таск 03 может опираться:**

- `CLIP_RANGE`, `SHOT_SPLIT`, `MATCH_SCALE`, `HANDOFF`, `JOIN` — прежние;
- композиция кадра покоя `p = 0` — прежняя (сверено с baseline);
- мобильная композиция — прежняя;
- `HeroCameraPlate` и `HeroLightField` — сигнатуры не менялись.

**Известный дефект, который таск 03 обязан починить** (виден на кадре
`screenshots/t02/desk-p20.png`): жёсткий горизонтальный шов примерно на 2/3 высоты
вьюпорта и пустая полоса под ним до начала услуг. Титры доехали до конца, а услуги
ещё не поднялись — это ровно тот стык, ради которого существует таск 03.
