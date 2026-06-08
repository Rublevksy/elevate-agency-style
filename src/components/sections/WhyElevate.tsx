import { Users, Layers, MessagesSquare, FileSearch, Clock, Languages } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";



const COPY: Record<Lang, { eyebrow: string; title: string; lead: string; items: { t: string; d: string }[] }> = {
  CZ: {
    eyebrow: "Proč ELEVATE",
    title: "Důvody, proč nám klienti svěřují projekty za 100 000+ Kč",
    lead: "Spojujeme strategii, design a vývoj pod jednou střechou. Bez agenturní byrokracie, bez juniorů, bez nekonečných meetingů.",
    items: [
      { t: "Senior tým bez juniorů", d: "Na projektu pracují přímo lidé, kteří navrhují a kódují. Žádný account manager mezi vámi a výstupem." },
      { t: "UX, strategie a vývoj v jednom", d: "Nepřehazujeme práci mezi externí dodavatele. Jeden tým, jedna zodpovědnost, jeden výsledek." },
      { t: "Přímá komunikace", d: "Píšete přímo seniorovi, který projekt vede. Rozhodnutí padají do hodin, ne do týdnů." },
      { t: "Audit zdarma", d: "Začneme tím, co reálně brzdí váš web — bez závazku a do 48 hodin máte konkrétní doporučení." },
      { t: "Odpověď do 24 hodin", d: "Garantujeme reakci do jednoho pracovního dne. V průběhu projektu obvykle do několika hodin." },
      { t: "CZ / EN / RU / UA", d: "Komunikujeme ve čtyřech jazycích. Pracujeme s klienty napříč střední a východní Evropou." },
    ],
  },
  EN: {
    eyebrow: "Why ELEVATE",
    title: "Why clients trust us with projects worth 100,000+ CZK",
    lead: "Strategy, design and engineering under one roof. No agency bureaucracy, no juniors, no endless meetings.",
    items: [
      { t: "Senior team, no juniors", d: "The people designing and coding your project are the ones you talk to. No account manager in between." },
      { t: "UX, strategy & engineering in one", d: "We don't hand work over to external suppliers. One team, one responsibility, one outcome." },
      { t: "Direct communication", d: "You message the senior leading the project. Decisions take hours, not weeks." },
      { t: "Free audit", d: "We start with what's actually holding your site back — no commitment, concrete recommendations within 48 hours." },
      { t: "Reply within 24 hours", d: "We guarantee a reply within one working day. During projects, usually within hours." },
      { t: "CZ / EN / RU / UA", d: "We work in four languages with clients across Central and Eastern Europe." },
    ],
  },
  RU: {
    eyebrow: "Почему ELEVATE",
    title: "Почему клиенты доверяют нам проекты от 100 000 Kč",
    lead: "Стратегия, дизайн и разработка под одной крышей. Без агентурной бюрократии, без джунов, без бесконечных созвонов.",
    items: [
      { t: "Сениоры без джунов", d: "Над проектом работают те, кто проектирует и кодит. Никаких аккаунтов между вами и результатом." },
      { t: "UX, стратегия и разработка вместе", d: "Не передаём задачи внешним подрядчикам. Одна команда, одна ответственность, один результат." },
      { t: "Прямая коммуникация", d: "Пишете напрямую сениору, который ведёт проект. Решения занимают часы, не недели." },
      { t: "Аудит бесплатно", d: "Начинаем с того, что реально мешает вашему сайту — без обязательств, рекомендации за 48 часов." },
      { t: "Ответ в течение 24 часов", d: "Гарантируем ответ за 1 рабочий день. По проекту обычно за пару часов." },
      { t: "CZ / EN / RU / UA", d: "Работаем на четырёх языках с клиентами по всей Центральной и Восточной Европе." },
    ],
  },
  UA: {
    eyebrow: "Чому ELEVATE",
    title: "Чому клієнти довіряють нам проєкти від 100 000 Kč",
    lead: "Стратегія, дизайн і розробка під одним дахом. Без агенційної бюрократії, без джунів, без нескінченних зідзвонів.",
    items: [
      { t: "Сеньйори без джунів", d: "Над проєктом працюють ті, хто проєктує і кодить. Жодних акаунт-менеджерів між вами та результатом." },
      { t: "UX, стратегія і розробка разом", d: "Не передаємо завдання зовнішнім підрядникам. Одна команда, одна відповідальність." },
      { t: "Пряма комунікація", d: "Пишете напряму сеньйору, який веде проєкт. Рішення — за години, не за тижні." },
      { t: "Аудит безкоштовно", d: "Починаємо з того, що реально гальмує сайт — без зобов'язань, рекомендації за 48 годин." },
      { t: "Відповідь за 24 години", d: "Гарантуємо відповідь за 1 робочий день. У ході проєкту — зазвичай за години." },
      { t: "CZ / EN / RU / UA", d: "Працюємо чотирма мовами з клієнтами по всій Центральній і Східній Європі." },
    ],
  },
};

const ICONS = [Users, Layers, MessagesSquare, FileSearch, Clock, Languages];

export function WhyElevate() {
  const { lang } = useT();
  const c = COPY[lang];

  return (
    <section className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[34rem] w-[34rem] rounded-full bg-primary/[0.06] blur-[180px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-[0.14] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] pointer-events-none" />

      <div className="container-luxe relative">
        <div className="max-w-3xl mb-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary mb-5">{c.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.02em] text-foreground leading-[1.05] mb-6">
            {c.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{c.lead}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {c.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={it.t}
                className="reveal group relative bg-background p-8 md:p-10 transition-colors duration-500 hover:bg-surface/60"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="h-11 w-11 rounded-lg border border-border bg-surface/60 grid place-items-center mb-6 text-primary transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-5px_oklch(0.72_0.18_250/0.6)]">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2.5 tracking-tight">{it.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
