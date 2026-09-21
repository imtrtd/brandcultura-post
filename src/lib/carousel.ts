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

export type KitId = "all" | "mark" | "release" | "system" | "mix";

export type Project = {
  v: 1;
  kit: KitId;
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

/** Three kits + MIX — from handwritten brief + live brandcultura.art */
export const KITS: Record<
  KitId,
  { label: string; slide1: Slide1; slide2: Slide2; slide3: Slide3 }
> = {
  all: {
    label: "All kits",
    slide1: {
      slideNum: "01 / 03",
      title: "3 KITS",
      subtitle: "ONE MIX",
      body: [
        "MARK — no name, no face, no grid yet.",
        "RELEASE — tracks exist. The post still looks like a story.",
        "SYSTEM — people come. Site is dead. No collab door.",
        "Trampoline, not decoration. Then you grow.",
      ],
      footerLabel: "STRATEGY · IDENTITY · GROWTH",
      footerSlide: "SLIDE 1 / 3",
    },
    slide2: {
      slideNum: "02 / 03",
      h1: "WHAT'S",
      h2: "INCLUDED",
      items: [
        "MARK: logo, 2 colors, 1 type pair, avatar, 1-page guide",
        "RELEASE: cover + stream square, 3–5 grid, mini-site",
        "SYSTEM: audit, site, collab-block, cover-system + presskit",
        "MIX: merch, stickers, print, special — on brief",
      ],
    },
    slide3: {
      slideNum: "03 / 03",
      h1: "PRICE",
      h2: "TIMELINE",
      rows: [
        { label: "MARK · 7–10 days", value: "360 €" },
        { label: "RELEASE · 10–14 days", value: "850 €" },
        { label: "SYSTEM · 3–5 weeks", value: "2 200 €" },
        { label: "MIX · on brief", value: "quote" },
      ],
      cta: "REQUEST KIT →",
      footer: "brandcultura.art",
    },
  },
  mark: {
    label: "MARK",
    slide1: {
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
    },
    slide2: {
      slideNum: "02 / 03",
      h1: "WHAT'S",
      h2: "INCLUDED",
      items: [
        "Logo: one direction, one finale",
        "Short code: 2 colors, 1 type pair",
        "Avatar + social cover",
        "1-page guide: how you use it",
      ],
    },
    slide3: {
      slideNum: "03 / 03",
      h1: "PRICE",
      h2: "TIMELINE",
      rows: [
        { label: "List price", value: "360 €" },
        { label: "Focus / Case", value: "280 €" },
        { label: "Deposit", value: "120 €" },
        { label: "Duration", value: "7–10 days" },
      ],
      cta: "REQUEST MARK →",
      footer: "brandcultura.art",
    },
  },
  release: {
    label: "RELEASE",
    slide1: {
      slideNum: "01 / 03",
      title: "02 RELEASE",
      subtitle: "LITTLE KNOWN",
      body: [
        "Tracks on SoundCloud or Spotify.",
        "Instagram and a rough portfolio exist.",
        "The release should look like a release —",
        "not like a story from the phone.",
      ],
      footerLabel: "COVER · GRID · MINI-SITE",
      footerSlide: "SLIDE 1 / 3",
    },
    slide2: {
      slideNum: "02 / 03",
      h1: "WHAT'S",
      h2: "INCLUDED",
      items: [
        "Cover + square for streaming",
        "3–5 grid pieces: post, story, promo",
        "Mini-site or portfolio page",
        "Existing logo stays if it still holds",
      ],
    },
    slide3: {
      slideNum: "03 / 03",
      h1: "PRICE",
      h2: "TIMELINE",
      rows: [
        { label: "List price", value: "850 €" },
        { label: "Focus / Case", value: "650 €" },
        { label: "Deposit", value: "250 €" },
        { label: "Duration", value: "10–14 days" },
      ],
      cta: "REQUEST RELEASE →",
      footer: "brandcultura.art",
    },
  },
  system: {
    label: "SYSTEM",
    slide1: {
      slideNum: "01 / 03",
      title: "03 SYSTEM",
      subtitle: "GAINING",
      body: [
        "You already pull people in — or you're known.",
        "Strong covers. Daily output. Dead site.",
        "No door for collabs.",
        "Not a prettier picture. A working shell.",
      ],
      footerLabel: "AUDIT · SITE · COLLAB · PRESSKIT",
      footerSlide: "SLIDE 1 / 3",
    },
    slide2: {
      slideNum: "02 / 03",
      h1: "WHAT'S",
      h2: "INCLUDED",
      items: [
        "Audit: what stays, what dies",
        "Site: Releases, Dates, People, Contact",
        "Collab-Block: who, how, framework",
        "Cover-System for a series + Presskit",
      ],
    },
    slide3: {
      slideNum: "03 / 03",
      h1: "PRICE",
      h2: "TIMELINE",
      rows: [
        { label: "List price", value: "2 200 €" },
        { label: "Focus / Case", value: "1 600 €" },
        { label: "Deposit", value: "500 €" },
        { label: "Duration", value: "3–5 weeks" },
      ],
      cta: "REQUEST SYSTEM →",
      footer: "brandcultura.art",
    },
  },
  mix: {
    label: "MIX",
    slide1: {
      slideNum: "01 / 03",
      title: "04 MIX",
      subtitle: "YOUR BRIEF",
      body: [
        "No ready-made step. Your own stack.",
        "Logo, cover, site, grid, presskit, strategy.",
        "Merch, stickers, print — if the brief needs it.",
        "Clear scope and price before we start.",
      ],
      footerLabel: "MODULES · SPECIAL · ON BRIEF",
      footerSlide: "SLIDE 1 / 3",
    },
    slide2: {
      slideNum: "02 / 03",
      h1: "WHAT'S",
      h2: "INCLUDED",
      items: [
        "Modules from MARK / RELEASE / SYSTEM",
        "Only what the brief actually needs",
        "Merch · stickers · print on request",
        "Two revision rounds, same as fixed kits",
      ],
    },
    slide3: {
      slideNum: "03 / 03",
      h1: "PRICE",
      h2: "TIMELINE",
      rows: [
        { label: "List price", value: "on brief" },
        { label: "Focus / Case", value: "quote" },
        { label: "Deposit", value: "by scope" },
        { label: "Duration", value: "by brief" },
      ],
      cta: "REQUEST MIX →",
      footer: "brandcultura.art",
    },
  },
};

export const KIT_ORDER: KitId[] = ["all", "mark", "release", "system", "mix"];

export const DEFAULT_SLIDE1: Slide1 = KITS.all.slide1;
export const DEFAULT_SLIDE2: Slide2 = KITS.all.slide2;
export const DEFAULT_SLIDE3: Slide3 = KITS.all.slide3;

export const MARK_SRC = "/brandcultura-mark.png";

export function slidesFromKit(kit: KitId) {
  const k = KITS[kit];
  return {
    kit,
    slide1: structuredClone(k.slide1),
    slide2: structuredClone(k.slide2),
    slide3: structuredClone(k.slide3),
  };
}

export function defaultProject(): Project {
  return {
    v: 1,
    ...slidesFromKit("all"),
    layers: { ...DEFAULT_LAYERS },
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
  const kit = p.kit && p.kit in KITS ? p.kit : "all";
  return {
    ...base,
    ...p,
    v: 1,
    kit,
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
