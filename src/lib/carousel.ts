export const BC = {
  bg: "#050505",
  pink: "#FF2B8A",
  lime: "#C6EF00",
  white: "#FFFFFF",
  dim: "#B8B8B8",
  panel: "#0D0D0D",
  panelBorder: "#1C1C1C",
  inputBg: "#181818",
  inputBorder: "#252525",
  mute: "#6A6A6A",
  ghost: "#3D3D3D",
} as const;

export type LayerKey =
  | "background"
  | "brandMark"
  | "shapes"
  | "waveform"
  | "text"
  | "photo";

export type Layers = Record<LayerKey, boolean>;

export const DEFAULT_LAYERS: Layers = {
  background: true,
  brandMark: true,
  shapes: true,
  waveform: true,
  text: true,
  photo: true,
};

export type Offset = { x: number; y: number };

export type Slide1 = {
  slideNum: string;
  title: string;
  subtitle: string;
  body: string[];
  footerLabel: string;
  footerSlide: string;
};

export type Slide2 = {
  slideNum: string;
  h1: string;
  h2: string;
  items: string[];
};

export type PriceRow = { label: string; value: string };

export type Slide3 = {
  slideNum: string;
  h1: string;
  h2: string;
  rows: PriceRow[];
  cta: string;
  footer: string;
};

export type Project = {
  v: 1;
  layers: Layers;
  slide1: Slide1;
  slide2: Slide2;
  slide3: Slide3;
  offsets: Record<string, Offset>;
  markSrc: string;
  photoSrc: string | null;
  bgSrc: string | null;
};

export const WAVE_A = [
  8, 9, 12, 11, 22, 32, 36, 32, 22, 25, 34, 35, 31, 25, 27, 35, 52, 67, 71, 58,
  41, 76, 104, 112, 96, 63, 59, 85, 92, 81, 62, 49, 51, 67, 86, 96, 84, 52, 97,
  134, 148, 131, 88, 68, 107, 123, 112, 86, 59, 57, 64, 76, 73, 51, 77, 108,
  123, 112, 78, 49, 84, 101, 95, 47, 44, 37, 34, 36, 35, 48, 54, 35, 17, 35, 32,
  23, 13, 8, 8, 8,
];

export const WAVE_B = [
  40, 77, 120, 158, 178, 173, 137, 76, 81, 157, 217, 247, 239, 194, 121, 43,
  123, 183, 211, 206, 171, 119, 63, 65, 95, 105,
];

export const DEFAULT_SLIDE1: Slide1 = {
  slideNum: "01 / 03",
  title: "01 MARK",
  subtitle: "WITHOUT A NAME",
  body: [
    "For artists without a name or face.",
    "No logo, no grid, no recognizable project yet.",
    "Become nameable and recognizable",
    "before your first big release.",
  ],
  footerLabel: "STRATEGY · IDENTITY · PRE-RECOGNITION",
  footerSlide: "SLIDE 1 / 3",
};

export const DEFAULT_SLIDE2: Slide2 = {
  slideNum: "02 / 03",
  h1: "WHAT'S",
  h2: "INCLUDED",
  items: [
    "Audit: what stays, what dies",
    "Site: Releases, Dates, People, Contact",
    "Collab-Block: who, how, framework",
    "Cover-System for a series + Presskit",
  ],
};

export const DEFAULT_SLIDE3: Slide3 = {
  slideNum: "03 / 03",
  h1: "PRICE",
  h2: "TIMELINE",
  rows: [
    { label: "List price", value: "2200 €" },
    { label: "Focus / Case", value: "1600 €" },
    { label: "Deposit", value: "500 €" },
    { label: "Duration", value: "3–5 weeks" },
  ],
  cta: "REQUEST PACKAGE →",
  footer: "brandcultura.art",
};

export const MARK_SRC = "/brandcultura-mark.png";

export function defaultProject(): Project {
  return {
    v: 1,
    layers: { ...DEFAULT_LAYERS },
    slide1: structuredClone(DEFAULT_SLIDE1),
    slide2: structuredClone(DEFAULT_SLIDE2),
    slide3: structuredClone(DEFAULT_SLIDE3),
    offsets: {},
    markSrc: MARK_SRC,
    photoSrc: null,
    bgSrc: null,
  };
}

export function parseProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<Project>;
  if (p.v !== 1 || !p.slide1 || !p.slide2 || !p.slide3) return null;
  const base = defaultProject();
  return {
    ...base,
    ...p,
    v: 1,
    layers: { ...base.layers, ...(p.layers ?? {}) },
    slide1: { ...base.slide1, ...p.slide1 },
    slide2: { ...base.slide2, ...p.slide2 },
    slide3: { ...base.slide3, ...p.slide3 },
    offsets: p.offsets ?? {},
  };
}

export const LAYER_META: { key: LayerKey; label: string; icon: string }[] = [
  { key: "background", label: "Background", icon: "▪" },
  { key: "brandMark", label: "Brand Mark", icon: "◈" },
  { key: "shapes", label: "Shapes & Deco", icon: "○" },
  { key: "waveform", label: "Waveform", icon: "≋" },
  { key: "text", label: "Text", icon: "T" },
  { key: "photo", label: "Photo overlay", icon: "▣" },
];
