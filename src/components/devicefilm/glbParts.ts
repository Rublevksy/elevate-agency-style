import { Box3, Quaternion, Vector3, type Matrix4, type Object3D } from "three";
import { DEVICE } from "./film";

/**
 * Node names taken from the supplied GLB (`macbook_pro_14_inch_M5.glb`).
 * The export uses obfuscated names, so they were identified by inspecting the
 * scene graph and the per-mesh bounding boxes:
 *
 *   HOLDER  nIhhmAXgzOpXafM  — shared parent of base + lid (identity transform)
 *   BASE    EhCmdLAMoLoXcIA  — top case: keyboard, trackpad, deck, ports, feet
 *   LID     RcexTyyhpuJYATQ  — display assembly: back shell, bezel, panel, glass
 *   HINGE   WyuoVWKMOcOlXJM  — the hinge barrel; gives the real rotation axis
 *   PANEL   tfTbkkzhxqpKRgC  — the emissive display panel (baked wallpaper)
 */
export const NODE = {
  HOLDER: "nIhhmAXgzOpXafM",
  BASE: "EhCmdLAMoLoXcIA",
  LID: "RcexTyyhpuJYATQ",
  HINGE: "WyuoVWKMOcOlXJM",
  PANEL: "tfTbkkzhxqpKRgC",
} as const;

export type MacbookParts = {
  base: Object3D;
  lid: Object3D;
  panel: Object3D;
  /** orientation baked into the GLB root (Z-up model → Y-up world) */
  quaternion: Quaternion;
  /** uniform scale that maps the model onto DEVICE.W world units */
  scale: number;
  /** hinge axis position, world units, before centring */
  hinge: Vector3;
  /** display centre relative to the hinge, world units */
  screenOffset: Vector3;
  /** display active area, world units */
  screenW: number;
  screenH: number;
  /** display normal, in radians, relative to the lid plane */
  screenTilt: number;
  /** lid angle authored in the GLB (degrees from the closed position) */
  openDeg: number;
  /** translation that puts the deck bottom on y = 0 and the hinge at -D/2 */
  offset: Vector3;
};

/** Local-space (HOLDER) bounding box of an object, in model units. */
function localBox(o: Object3D, toLocal: Matrix4) {
  return new Box3().setFromObject(o).applyMatrix4(toLocal);
}

/**
 * Measurements are cached per loaded scene: the base / lid nodes get reparented
 * into the R3F tree, so a second `getObjectByName` pass on the same scene (a
 * remount or HMR) would no longer find them.
 */
const measured = new WeakMap<Object3D, MacbookParts>();

/**
 * Measures the supplied GLB and derives every number the cinematic needs:
 * real hinge axis, display plane, and the scale/offset that map the model onto
 * the existing DEVICE dimensions so the camera track keeps working unchanged.
 */
export function measureMacbook(scene: Object3D): MacbookParts {
  const cached = measured.get(scene);
  if (cached) return cached;

  const holder = scene.getObjectByName(NODE.HOLDER);
  const base = scene.getObjectByName(NODE.BASE);
  const lid = scene.getObjectByName(NODE.LID);
  const hingeNode = scene.getObjectByName(NODE.HINGE);
  const panel = scene.getObjectByName(NODE.PANEL);
  if (!holder || !base || !lid || !hingeNode || !panel) {
    throw new Error("macbook GLB: expected nodes not found");
  }


  scene.updateMatrixWorld(true);
  const toLocal = holder.matrixWorld.clone().invert();

  const baseBox = localBox(base, toLocal);
  const lidBox = localBox(lid, toLocal);
  const hingeBox = localBox(hingeNode, toLocal);
  const panelBox = localBox(panel, toLocal);

  // the GLB root carries the Z-up → Y-up rotation; reuse it verbatim
  const quaternion = new Quaternion();
  holder.matrixWorld.decompose(new Vector3(), quaternion, new Vector3());

  const width = Math.max(baseBox.max.x - baseBox.min.x, lidBox.max.x - lidBox.min.x);
  const scale = DEVICE.W / width;

  const toWorld = (v: Vector3) => v.clone().multiplyScalar(scale).applyQuaternion(quaternion);

  const hinge = toWorld(hingeBox.getCenter(new Vector3()));
  hinge.x = 0;
  const screenCentre = toWorld(panelBox.getCenter(new Vector3()));
  const screenOffset = screenCentre.clone().sub(hinge);
  screenOffset.x = 0;

  // the lid is authored open: the angle between the base plane (+Z, forward)
  // and the hinge → display vector is the GLB's own open angle
  const openDeg = (Math.atan2(screenOffset.y, screenOffset.z) * 180) / Math.PI;
  const screenTilt = ((openDeg - 90) * Math.PI) / 180;

  const panelSize = panelBox.getSize(new Vector3()).multiplyScalar(scale);
  const screenW = panelSize.x;
  const screenH = Math.hypot(panelSize.y, panelSize.z);

  // deck bottom on the ground plane, hinge axis at the deck's back edge
  const baseCorners: Vector3[] = [];
  for (const x of [baseBox.min.x, baseBox.max.x])
    for (const y of [baseBox.min.y, baseBox.max.y])
      for (const z of [baseBox.min.z, baseBox.max.z]) baseCorners.push(toWorld(new Vector3(x, y, z)));
  const minY = Math.min(...baseCorners.map((v) => v.y));
  const offset = new Vector3(0, -minY, -hinge.z - DEVICE.D / 2);

  const parts: MacbookParts = {
    base,
    lid,
    panel,
    quaternion,
    scale,
    hinge,
    screenOffset,
    screenW,
    screenH,
    screenTilt,
    openDeg,
    offset,
  };
  measured.set(scene, parts);
  return parts;
}

