import logo from "@/assets/elevate-logo.png";

export function Logo({ className = "h-8 w-auto", alt = "ELEVATE" }: { className?: string; alt?: string }) {
  return <img src={logo} alt={alt} className={className} loading="eager" decoding="async" />;
}
