import { Instagram, Phone, Send } from "lucide-react";

// Brand contact data — single source of truth
export const CONTACT_PHONE = "+420 776 956 616";
export const CONTACT_PHONE_HREF = "tel:+420776956616";
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61590658380641",
  tiktok: "https://www.tiktok.com/@elevateit.cz",
  instagram: "https://www.instagram.com/elevateit.cz/",
  telegram: "https://t.me/elevateit",
} as const;

// Inline SVGs (lucide-react doesn't ship Facebook/TikTok with matching weight)
function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21.5v-8h2.7l.4-3.2h-3.1V8.2c0-.9.3-1.5 1.6-1.5h1.6V3.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.6H7.8v3.2h2.7v8h3z" />
    </svg>
  );
}

function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.6 6.7a5.5 5.5 0 0 1-3.2-1.1 5.5 5.5 0 0 1-2.1-3.3h-3v13.1c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5c.3 0 .5 0 .8.1v-3a5.6 5.6 0 1 0 4.7 5.5V9.3a8.4 8.4 0 0 0 5.3 1.8v-3a5.6 5.6 0 0 1 0-1.4z" />
    </svg>
  );
}

type Size = "sm" | "md";

export function SocialIcons({
  size = "md",
  showPhone = true,
  variant = "default",
}: {
  size?: Size;
  showPhone?: boolean;
  variant?: "default" | "ghost";
}) {
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const btnSize = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const base =
    "group inline-flex items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_10px_30px_-12px_oklch(0.72_0.18_250/0.7)]";
  const border =
    variant === "ghost"
      ? "border-border/40 bg-background/40 text-foreground/80"
      : "border-border bg-surface/60 text-foreground";

  const items: { href: string; label: string; icon: React.ReactNode }[] = [
    { href: SOCIAL_LINKS.instagram, label: "Instagram", icon: <Instagram className={iconClass} strokeWidth={1.6} /> },
    { href: SOCIAL_LINKS.facebook, label: "Facebook", icon: <FacebookIcon className={iconClass} /> },
    { href: SOCIAL_LINKS.tiktok, label: "TikTok", icon: <TikTokIcon className={iconClass} /> },
    { href: SOCIAL_LINKS.telegram, label: "Telegram", icon: <Send className={iconClass} strokeWidth={1.6} /> },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {showPhone && (
        <a
          href={CONTACT_PHONE_HREF}
          aria-label={`Zavolat ${CONTACT_PHONE}`}
          className={`${base} ${border} ${btnSize === "h-9 w-9" ? "h-9" : "h-11"} px-3.5 gap-2 text-sm font-medium`}
        >
          <Phone className={iconClass} strokeWidth={1.7} />
          <span className="tabular-nums">{CONTACT_PHONE}</span>
        </a>
      )}
      {items.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          className={`${base} ${border} ${btnSize}`}
        >
          <span className="transition-transform duration-300 group-hover:scale-110">{s.icon}</span>
        </a>
      ))}
    </div>
  );
}
