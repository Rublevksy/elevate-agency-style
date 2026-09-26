import type { ProjectSlug } from "@/lib/projects";

export type ProjectMapPoint = {
  slug: ProjectSlug;
  /** Artistic scene coordinates, not geographic coordinates. */
  scene: { x: number; y: number; depth: number };
  address: string | null;
  coordinates: { lat: number; lng: number } | null;
  addressStatus: "needs-owner-confirmation";
};

/**
 * The map is intentionally schematic until the owner confirms exact client
 * addresses and coordinates. These positions only compose the miniature city;
 * they must never be presented as real-world locations.
 */
export const PROJECT_MAP_POINTS: ProjectMapPoint[] = [
  {
    slug: "biodent-clinic",
    scene: { x: 26, y: 35, depth: 1 },
    address: null,
    coordinates: null,
    addressStatus: "needs-owner-confirmation",
  },
  {
    slug: "exclusive-beauty",
    scene: { x: 68, y: 26, depth: 2 },
    address: null,
    coordinates: null,
    addressStatus: "needs-owner-confirmation",
  },
  {
    slug: "nhome-praha",
    scene: { x: 76, y: 66, depth: 3 },
    address: null,
    coordinates: null,
    addressStatus: "needs-owner-confirmation",
  },
  {
    slug: "euromotors",
    scene: { x: 34, y: 73, depth: 4 },
    address: null,
    coordinates: null,
    addressStatus: "needs-owner-confirmation",
  },
];
