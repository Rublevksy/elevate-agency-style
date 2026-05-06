import { useT, type Lang } from "@/lib/i18n";

const MONTHS: Record<Lang, string[]> = {
  CZ: ["lednu","únoru","březnu","dubnu","květnu","červnu","červenci","srpnu","září","říjnu","listopadu","prosinci"],
  EN: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  RU: ["январе","феврале","марте","апреле","мае","июне","июле","августе","сентябре","октябре","ноябре","декабре"],
  UA: ["січні","лютому","березні","квітні","травні","червні","липні","серпні","вересні","жовтні","листопаді","грудні"],
};

const PREFIX: Record<Lang, string> = {
  CZ: "Volná kapacita: 2 místa v",
  EN: "Available: 2 spots in",
  RU: "Свободно: 2 места в",
  UA: "Вільно: 2 місця у",
};

export function CapacityBadge({ className = "" }: { className?: string }) {
  const { lang } = useT();
  const month = MONTHS[lang][new Date().getMonth()];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-300 ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
      </span>
      {PREFIX[lang]} {month}
    </span>
  );
}
