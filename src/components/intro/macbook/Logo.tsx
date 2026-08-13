import logo from "@/assets/elevate-logo.png";

/**
 * Etched ELEVATE mark on the aluminium lid shell. `flip` compensates for the
 * mirrored coordinate space of the lid's outer face.
 */
export function LidLogo({ W, flip = false }: { W: number; flip?: boolean }) {
  return (
    <img
      src={logo}
      alt=""
      aria-hidden
      decoding="async"
      style={{
        width: W * 0.3,
        height: "auto",
        opacity: 0.42,
        transform: flip ? "scaleY(-1)" : undefined,
        filter: "grayscale(0.5) brightness(1.35) contrast(0.9)",
        mixBlendMode: "screen",
      }}
    />
  );
}
