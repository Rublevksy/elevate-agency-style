import { CalendarClock, FileCheck2, Users, LineChart } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

type Item = { t: string; d: string };
type Block = {
  eyebrow: string;
  title: string;
  lead: string;
  weeklyTitle: string;
  weekly: Item[];
  youGetTitle: string;
  youGet: string[];
  weNeedTitle: string;
  weNeed: string[];
  note: string;
};

const COPY: Record<Lang, Block> = {
  CZ: {
    eyebrow: "Jak spolupráce probíhá",
    title: "Žádná černá skříňka. Vidíte do projektu od prvního dne.",
    lead: "Pracujeme v krátkých cyklech s pravidelnými check-iny. Žádné měsíce ticha a pak velké překvapení — průběžně schvalujete směr, ne až hotový výsledek.",
    weeklyTitle: "Týdenní rytmus",
    weekly: [
      { t: "Kickoff", d: "60–90 min workshop. Cíle, cílová skupina, KPI, technické limity, konkurence." },
      { t: "Týdenní check-in", d: "30 min hovor každý týden. Status, rozhodnutí, další krok. Bez zbytečných meetingů." },
      { t: "Průběžné review", d: "Prototyp nebo build dostáváte k připomínkám v reálném čase — ne na konci sprintu." },
      { t: "Post-launch", d: "30 dní po spuštění sledujeme data, ladíme drobnosti, řešíme případné incidenty." },
    ],
    youGetTitle: "Co od nás dostanete",
    youGet: [
      "Senior, který projekt vede od začátku do konce",
      "Klikatelný prototyp ke schválení před vývojem",
      "Pravidelný status v psané formě (žádná ztracená rozhodnutí)",
      "Předání: dokumentace, přístupy, krátké video onboarding",
      "30 dní bezplatné podpory po spuštění",
    ],
    weNeedTitle: "Co potřebujeme od vás",
    weNeed: [
      "Jednu kontaktní osobu s rozhodovací pravomocí",
      "Materiály k značce a produktu (co máte, stačí)",
      "Odpovědi na otázky do 2 pracovních dnů",
      "Schválení milníků v dohodnutém termínu",
    ],
    note: "Smlouva, fixní rozpočet a fixní termín. Žádné fakturace po hodinách bez stropu.",
  },
  EN: {
    eyebrow: "How we work together",
    title: "No black box. You see into the project from day one.",
    lead: "We work in short cycles with regular check-ins. No months of silence followed by a big surprise — you approve direction continuously, not just the final result.",
    weeklyTitle: "Weekly rhythm",
    weekly: [
      { t: "Kickoff", d: "60–90 min workshop. Goals, audience, KPIs, technical constraints, competition." },
      { t: "Weekly check-in", d: "30 min call every week. Status, decisions, next step. No unnecessary meetings." },
      { t: "Continuous review", d: "You see the prototype or build in real time — not at the end of a sprint." },
      { t: "Post-launch", d: "30 days after launch we watch the data, fine-tune details, handle any incidents." },
    ],
    youGetTitle: "What you get from us",
    youGet: [
      "A senior leading the project from start to finish",
      "A clickable prototype to approve before development",
      "Written status updates (no decisions lost in calls)",
      "Handover: documentation, credentials, short onboarding video",
      "30 days of free support after launch",
    ],
    weNeedTitle: "What we need from you",
    weNeed: [
      "One contact person with decision-making authority",
      "Brand and product materials (whatever you have)",
      "Answers to questions within 2 working days",
      "Milestone approvals on the agreed date",
    ],
    note: "Contract, fixed budget, fixed timeline. No open-ended hourly billing.",
  },
  RU: {
    eyebrow: "Как идёт работа",
    title: "Никакого чёрного ящика. Вы видите проект с первого дня.",
    lead: "Работаем короткими циклами с регулярными созвонами. Никаких месяцев тишины и сюрприза в конце — направление утверждаете по ходу, а не по факту.",
    weeklyTitle: "Недельный ритм",
    weekly: [
      { t: "Kickoff", d: "60–90 мин воркшоп. Цели, аудитория, KPI, технические ограничения, конкуренты." },
      { t: "Еженедельный созвон", d: "30 минут раз в неделю. Статус, решения, следующий шаг." },
      { t: "Постоянное ревью", d: "Прототип или сборку видите в реальном времени, а не в конце спринта." },
      { t: "Пост-запуск", d: "30 дней после запуска следим за данными, доводим детали, решаем инциденты." },
    ],
    youGetTitle: "Что вы получаете",
    youGet: [
      "Сениор ведёт проект от начала до конца",
      "Кликабельный прототип на утверждение до разработки",
      "Письменные статусы (решения не теряются)",
      "Передача: документация, доступы, видео-онбординг",
      "30 дней бесплатной поддержки после запуска",
    ],
    weNeedTitle: "Что нужно от вас",
    weNeed: [
      "Один контакт с правом принимать решения",
      "Материалы по бренду и продукту (что есть)",
      "Ответы на вопросы в течение 2 рабочих дней",
      "Утверждение этапов в срок",
    ],
    note: "Договор, фиксированный бюджет и срок. Без бесконечных часов.",
  },
  UA: {
    eyebrow: "Як проходить співпраця",
    title: "Жодної чорної скриньки. Ви бачите проєкт з першого дня.",
    lead: "Працюємо короткими циклами з регулярними зідзвонами. Жодних місяців тиші й сюрпризу в кінці — напрямок узгоджуєте по ходу.",
    weeklyTitle: "Тижневий ритм",
    weekly: [
      { t: "Kickoff", d: "60–90 хв воркшоп. Цілі, аудиторія, KPI, технічні обмеження, конкуренти." },
      { t: "Тижневий зідзвон", d: "30 хв раз на тиждень. Статус, рішення, наступний крок." },
      { t: "Постійне рев'ю", d: "Прототип чи збірку бачите в реальному часі, а не в кінці спринту." },
      { t: "Після запуску", d: "30 днів стежимо за даними, доводимо деталі, вирішуємо інциденти." },
    ],
    youGetTitle: "Що ви отримуєте",
    youGet: [
      "Сеньйор веде проєкт від початку до кінця",
      "Клікабельний прототип на затвердження до розробки",
      "Письмові статуси (рішення не губляться)",
      "Передача: документація, доступи, відео-онбординг",
      "30 днів безкоштовної підтримки після запуску",
    ],
    weNeedTitle: "Що потрібно від вас",
    weNeed: [
      "Один контакт з правом приймати рішення",
      "Матеріали бренду та продукту (що є)",
      "Відповіді на питання протягом 2 робочих днів",
      "Затвердження етапів у строк",
    ],
    note: "Договір, фіксований бюджет і термін. Без нескінченних годин.",
  },
};

const ICONS = [CalendarClock, Users, FileCheck2, LineChart];

export function Collaboration() {
  const { lang } = useT();
  const c = COPY[lang];

  return (
    <section className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-primary/[0.05] blur-[160px]"
      />
      <div className="container-luxe relative">
        <div className="max-w-2xl mb-16">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            {c.eyebrow}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            {c.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{c.lead}</p>
        </div>

        {/* Weekly rhythm */}
        <div className="mb-20">
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-8">
            {c.weeklyTitle}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.weekly.map((it, i) => {
              const Icon = ICONS[i];
              return (
                <div
                  key={i}
                  className="group p-7 rounded-xl border border-border bg-surface/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40"
                >
                  <Icon className="h-5 w-5 text-primary mb-5" strokeWidth={1.6} />
                  <h3 className="text-base font-bold text-foreground mb-2">{it.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Two columns: what you get / what we need */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="p-10 rounded-xl border border-primary/30 bg-surface/60">
            <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-6">
              {c.youGetTitle}
            </p>
            <ul className="space-y-3.5">
              {c.youGet.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-10 rounded-xl border border-border bg-surface/30">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">
              {c.weNeedTitle}
            </p>
            <ul className="space-y-3.5">
              {c.weNeed.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm text-foreground leading-relaxed">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
          <span className="text-foreground font-medium">{c.note}</span>
        </p>
      </div>
    </section>
  );
}
