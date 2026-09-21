import { useCallback, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { Download, Upload, Layers as LayersIcon } from "lucide-react";
import {
  BC,
  LAYER_META,
  defaultProject,
  parseProject,
  type LayerKey,
  type Offset,
  type Project,
} from "@/lib/carousel";
import { SlideOne, SlideTwo, SlideThree } from "./slides";

function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    if (file.type.startsWith("image/")) r.readAsDataURL(file);
    else r.readAsText(file);
  });
}

export function CarouselEditor() {
  const [project, setProject] = useState<Project>(defaultProject);
  const [slide, setSlide] = useState(0);
  const [selected, setSelected] = useState<string | null>("s1-title");
  const [overlays, setOverlays] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const markInput = useRef<HTMLInputElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  const bgInput = useRef<HTMLInputElement>(null);
  const jsonInput = useRef<HTMLInputElement>(null);

  const patch = useCallback((fn: (p: Project) => Project) => {
    setProject((p) => fn(p));
  }, []);

  const shared = {
    layers: project.layers,
    markSrc: project.markSrc,
    photoSrc: project.photoSrc,
    bgSrc: project.bgSrc,
    offsets: project.offsets,
    selected,
    showOverlays: overlays,
    onSelect: setSelected,
    onOffset: (id: string, next: Offset) =>
      patch((p) => ({ ...p, offsets: { ...p.offsets, [id]: next } })),
  };

  async function capture(index: number, hideOverlay: boolean) {
    const prev = slide;
    const prevOv = overlays;
    setSlide(index);
    if (hideOverlay) setOverlays(false);
    await new Promise((r) => setTimeout(r, 80));
    const { toPng } = await import("html-to-image");
    const node = stageRef.current;
    if (!node) throw new Error("stage missing");
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 1080 / Math.max(node.offsetWidth, 1),
      backgroundColor: project.layers.background ? BC.bg : "transparent",
      filter: (el) => {
        if (el instanceof HTMLElement && el.dataset.overlay === "1") return false;
        return true;
      },
    });
    setSlide(prev);
    setOverlays(prevOv);
    return dataUrl;
  }

  async function downloadPng() {
    try {
      setBusy("png");
      const url = await capture(slide, true);
      const res = await fetch(url);
      downloadBlob(await res.blob(), `brandcultura-slide-0${slide + 1}.png`);
      toast.success("PNG saved — 1080 × 1080");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(null);
    }
  }

  async function downloadZip() {
    try {
      setBusy("zip");
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      for (let i = 0; i < 3; i++) {
        const url = await capture(i, true);
        const b64 = url.split(",")[1] ?? "";
        zip.file(`slide-0${i + 1}.png`, b64, { base64: true });
      }
      zip.file("project.json", JSON.stringify(project, null, 2));
      const blob = await zip.generateAsync({ type: "blob" });
      downloadBlob(blob, "brandcultura-carousel.zip");
      toast.success("ZIP — 3 slides + project.json");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "ZIP failed");
    } finally {
      setBusy(null);
    }
  }

  function downloadJson() {
    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, "brandcultura-post.json");
    toast.success("Project JSON saved");
  }

  async function onMark(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const data = await readFile(f);
    patch((p) => ({ ...p, markSrc: data, layers: { ...p.layers, brandMark: true } }));
    toast.success("Brand mark replaced");
  }

  async function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const data = await readFile(f);
    patch((p) => ({ ...p, photoSrc: data, layers: { ...p.layers, photo: true } }));
    setSelected(`s${slide + 1}-photo`);
    toast.success("Photo overlay added — drag it on the slide");
  }

  async function onBg(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const data = await readFile(f);
    patch((p) => ({ ...p, bgSrc: data, layers: { ...p.layers, background: true } }));
    toast.success("Background image set");
  }

  async function onJson(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const parsed = parseProject(JSON.parse(await readFile(f)));
      if (!parsed) throw new Error("Not a Brandcultura project file");
      setProject(parsed);
      toast.success("Project loaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  function toggleLayer(key: LayerKey) {
    patch((p) => ({ ...p, layers: { ...p.layers, [key]: !p.layers[key] } }));
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#070707] text-white md:flex-row" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <input ref={markInput} type="file" accept="image/*" className="hidden" onChange={onMark} />
      <input ref={photoInput} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
      <input ref={bgInput} type="file" accept="image/*" className="hidden" onChange={onBg} />
      <input ref={jsonInput} type="file" accept="application/json,.json" className="hidden" onChange={onJson} />

      <aside className="order-2 flex max-h-[28vh] w-full shrink-0 flex-col overflow-y-auto border-t border-bc-line bg-bc-panel md:order-none md:max-h-none md:w-[220px] md:border-t-0 md:border-r">
        <div className="flex items-center gap-2.5 border-b border-bc-line px-4 py-4">
          <img
            src={project.markSrc}
            alt=""
            width={28}
            height={28}
            className="object-contain"
            style={{ filter: "drop-shadow(0 0 6px rgba(255,43,138,0.5))" }}
          />
          <div>
            <div className="text-[11px] font-black tracking-[2px]">LAYERS</div>
            <div className="text-[10px] text-[#444]">brandcultura.art</div>
          </div>
        </div>

        <div className="px-3 pt-3">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[1.8px] text-[#3D3D3D]">Slide</div>
          <div className="flex gap-1.5">
            {["01", "02", "03"].map((n, i) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  setSlide(i);
                  setSelected(i === 0 ? "s1-title" : i === 1 ? "s2-title" : "s3-title");
                }}
                className="flex-1 rounded-sm py-1.5 text-[11px] font-extrabold tracking-wide"
                style={{
                  background: slide === i ? BC.pink : BC.inputBg,
                  color: slide === i ? BC.white : "#555",
                  border: `1px solid ${slide === i ? BC.pink : BC.inputBorder}`,
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-3 py-4">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[1.8px] text-[#3D3D3D]">Visibility</div>
          {LAYER_META.map((row) => (
            <button
              key={row.key}
              type="button"
              onClick={() => toggleLayer(row.key)}
              className="mb-0.5 flex w-full items-center justify-between rounded-md px-2 py-1.5"
              style={{ background: project.layers[row.key] ? "#161616" : "transparent" }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-4 text-center text-[13px] font-bold"
                  style={{ color: project.layers[row.key] ? BC.lime : "#333" }}
                >
                  {row.icon}
                </span>
                <span
                  className="text-xs"
                  style={{ color: project.layers[row.key] ? BC.white : "#444" }}
                >
                  {row.label}
                </span>
              </span>
              <Toggle on={project.layers[row.key]} />
            </button>
          ))}

          <button
            type="button"
            onClick={() => setOverlays((v) => !v)}
            className="mt-3 flex w-full items-center justify-between rounded-md px-2 py-1.5"
            style={{ background: overlays ? "#161616" : "transparent" }}
          >
            <span className="flex items-center gap-2 text-xs">
              <LayersIcon className="size-3.5" style={{ color: overlays ? BC.lime : "#444" }} />
              Editor overlays
            </span>
            <Toggle on={overlays} />
          </button>
        </div>

        <div className="border-t border-bc-line px-3.5 py-4">
          <div className="mb-2 text-[9px] font-bold uppercase tracking-[1.8px] text-[#3D3D3D]">Palette</div>
          <div className="flex gap-1.5">
            {[BC.bg, BC.pink, BC.lime, BC.white, BC.dim].map((c) => (
              <div
                key={c}
                title={c}
                className="size-5 rounded-sm"
                style={{ background: c, border: `1.5px solid ${c === BC.bg ? "#111" : c === BC.white ? "#888" : c}` }}
              />
            ))}
          </div>
        </div>
      </aside>

      <main className="relative order-1 flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-hidden px-3 py-3 md:order-none md:px-7 md:py-4">
        <div className="order-2 flex w-full max-w-[560px] shrink-0 flex-nowrap items-center justify-start gap-1 overflow-x-auto py-1 md:order-1 md:flex-wrap md:justify-center md:gap-1.5">
          <span className="hidden pr-1 text-[8px] font-bold tracking-[1.6px] text-[#4A4A4A] uppercase sm:inline">
            Upload
          </span>
          <ToolBtn onClick={() => markInput.current?.click()} icon={<Upload className="size-3.5" />} label="Upload mark" short="Mark" />
          <ToolBtn onClick={() => photoInput.current?.click()} icon={<Upload className="size-3.5" />} label="Upload photo" short="Photo" />
          <ToolBtn onClick={() => bgInput.current?.click()} icon={<Upload className="size-3.5" />} label="Upload background" short="Bg" />
          <ToolBtn onClick={() => jsonInput.current?.click()} icon={<Upload className="size-3.5" />} label="Upload JSON project" short="JSON" />
          <span className="mx-1 h-4 w-px shrink-0 bg-[#252525]" />
          <span className="hidden pr-1 text-[8px] font-bold tracking-[1.6px] text-[#4A4A4A] uppercase sm:inline">
            Download
          </span>
          <ToolBtn onClick={downloadPng} icon={<Download className="size-3.5" />} label={busy === "png" ? "Saving…" : "Download PNG"} short={busy === "png" ? "…" : "PNG"} primary disabled={!!busy} />
          <ToolBtn onClick={downloadZip} icon={<Download className="size-3.5" />} label={busy === "zip" ? "Zipping…" : "Download ZIP"} short={busy === "zip" ? "…" : "ZIP"} disabled={!!busy} />
          <ToolBtn onClick={downloadJson} icon={<Download className="size-3.5" />} label="Download JSON" short="JSON" />
        </div>

        <div className="order-3 flex shrink-0 gap-2 py-1 md:order-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSlide(i);
                setSelected(i === 0 ? "s1-title" : i === 1 ? "s2-title" : "s3-title");
              }}
              className="h-2 rounded-full border-0 transition-all"
              style={{
                width: slide === i ? 24 : 8,
                background: slide === i ? BC.pink : "#252525",
              }}
            />
          ))}
        </div>

        <div className="relative order-1 min-h-0 w-full flex-1 md:order-3">
          <div className="absolute inset-0 flex items-center justify-center p-2">
            <div className="relative aspect-square h-full max-h-full w-auto max-w-full md:max-h-[520px]">
          {!project.layers.background ? (
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                backgroundImage: "repeating-conic-gradient(#181818 0% 25%, #101010 0% 50%)",
                backgroundSize: "18px 18px",
              }}
            />
          ) : null}
          <div
            ref={stageRef}
            className="absolute inset-0 overflow-hidden rounded-xl"
            style={{ boxShadow: "0 0 0 1px #1A1A1A, 0 20px 60px rgba(0,0,0,0.8)" }}
            onPointerDown={() => setSelected(null)}
          >
            {slide === 0 ? <SlideOne d={project.slide1} shared={shared} /> : null}
            {slide === 1 ? <SlideTwo d={project.slide2} shared={shared} /> : null}
            {slide === 2 ? <SlideThree d={project.slide3} shared={shared} /> : null}
          </div>
          <div className="absolute -top-4 right-0 hidden text-[10px] font-bold tracking-[1.2px] text-[#2A2A2A] md:block">
            1080 × 1080
          </div>
            </div>
          </div>
        </div>

        <div className="order-4 flex shrink-0 items-center gap-5 py-1 md:order-4">
          <button
            type="button"
            disabled={slide === 0}
            onClick={() => {
              setSlide((s) => Math.max(0, s - 1));
              setSelected(slide <= 1 ? "s1-title" : "s2-title");
            }}
            className="text-xs font-extrabold tracking-[2px] text-bc-pink disabled:opacity-20"
          >
            ← PREV
          </button>
          <span className="text-[11px] tracking-wide text-[#2A2A2A]">
            {slide + 1} / 3
          </span>
          <button
            type="button"
            disabled={slide === 2}
            onClick={() => {
              setSlide((s) => Math.min(2, s + 1));
              setSelected(slide >= 1 ? "s3-title" : "s2-title");
            }}
            className="text-xs font-extrabold tracking-[2px] text-bc-pink disabled:opacity-20"
          >
            NEXT →
          </button>
        </div>
      </main>

      <aside className="order-3 max-h-[28vh] w-full shrink-0 overflow-y-auto border-t border-bc-line bg-bc-panel px-4 py-4 md:order-none md:max-h-none md:w-[260px] md:border-t-0 md:border-l">
        <div className="mb-3.5 text-[9px] font-bold uppercase tracking-[1.8px] text-[#3D3D3D]">
          Text Cells — Slide {slide + 1}
        </div>
        {slide === 0 ? (
          <>
            <Field label="Slide number" value={project.slide1.slideNum} onChange={(v) => patch((p) => ({ ...p, slide1: { ...p.slide1, slideNum: v } }))} />
            <Field label="Title" value={project.slide1.title} onChange={(v) => patch((p) => ({ ...p, slide1: { ...p.slide1, title: v } }))} />
            <Field label="Subtitle" value={project.slide1.subtitle} onChange={(v) => patch((p) => ({ ...p, slide1: { ...p.slide1, subtitle: v } }))} />
            <Sect>Body</Sect>
            {project.slide1.body.map((line, i) => (
              <Field
                key={i}
                label={`Line ${i + 1}`}
                value={line}
                onChange={(v) =>
                  patch((p) => {
                    const body = [...p.slide1.body];
                    body[i] = v;
                    return { ...p, slide1: { ...p.slide1, body } };
                  })
                }
              />
            ))}
            <Sect>Footer</Sect>
            <Field label="Label" value={project.slide1.footerLabel} onChange={(v) => patch((p) => ({ ...p, slide1: { ...p.slide1, footerLabel: v } }))} />
            <Field label="Slide indicator" value={project.slide1.footerSlide} onChange={(v) => patch((p) => ({ ...p, slide1: { ...p.slide1, footerSlide: v } }))} />
          </>
        ) : null}
        {slide === 1 ? (
          <>
            <Field label="Slide number" value={project.slide2.slideNum} onChange={(v) => patch((p) => ({ ...p, slide2: { ...p.slide2, slideNum: v } }))} />
            <Field label="Heading line 1" value={project.slide2.h1} onChange={(v) => patch((p) => ({ ...p, slide2: { ...p.slide2, h1: v } }))} />
            <Field label="Heading line 2" value={project.slide2.h2} onChange={(v) => patch((p) => ({ ...p, slide2: { ...p.slide2, h2: v } }))} />
            <Sect>List Items</Sect>
            {project.slide2.items.map((item, i) => (
              <Field
                key={i}
                label={`Item ${i + 1}`}
                value={item}
                onChange={(v) =>
                  patch((p) => {
                    const items = [...p.slide2.items];
                    items[i] = v;
                    return { ...p, slide2: { ...p.slide2, items } };
                  })
                }
              />
            ))}
          </>
        ) : null}
        {slide === 2 ? (
          <>
            <Field label="Slide number" value={project.slide3.slideNum} onChange={(v) => patch((p) => ({ ...p, slide3: { ...p.slide3, slideNum: v } }))} />
            <Field label="Heading (before &)" value={project.slide3.h1} onChange={(v) => patch((p) => ({ ...p, slide3: { ...p.slide3, h1: v } }))} />
            <Field label="Heading line 2" value={project.slide3.h2} onChange={(v) => patch((p) => ({ ...p, slide3: { ...p.slide3, h2: v } }))} />
            <Sect>Price Rows</Sect>
            {project.slide3.rows.map((row, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <Field
                    label={`Label ${i + 1}`}
                    value={row.label}
                    onChange={(v) =>
                      patch((p) => ({
                        ...p,
                        slide3: {
                          ...p.slide3,
                          rows: p.slide3.rows.map((r, n) => (n === i ? { ...r, label: v } : r)),
                        },
                      }))
                    }
                  />
                </div>
                <div className="w-20">
                  <Field
                    label="Value"
                    value={row.value}
                    mono
                    onChange={(v) =>
                      patch((p) => ({
                        ...p,
                        slide3: {
                          ...p.slide3,
                          rows: p.slide3.rows.map((r, n) => (n === i ? { ...r, value: v } : r)),
                        },
                      }))
                    }
                  />
                </div>
              </div>
            ))}
            <Sect>CTA & Footer</Sect>
            <Field label="Button text" value={project.slide3.cta} onChange={(v) => patch((p) => ({ ...p, slide3: { ...p.slide3, cta: v } }))} />
            <Field label="Footer domain" value={project.slide3.footer} onChange={(v) => patch((p) => ({ ...p, slide3: { ...p.slide3, footer: v } }))} />
          </>
        ) : null}
      </aside>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className="relative h-[17px] w-[30px] shrink-0 rounded-full transition-colors"
      style={{ background: on ? BC.pink : "#282828" }}
    >
      <span
        className="absolute top-[2.5px] size-3 rounded-full bg-white transition-[left]"
        style={{ left: on ? 15 : 3 }}
      />
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="mb-2.5 block">
      <span className="mb-1 block text-[9px] font-bold uppercase tracking-[1.6px] text-[#4A4A4A]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-sm px-2.5 py-1.5 text-[13px] text-white outline-none"
        style={{
          background: BC.inputBg,
          border: `1px solid ${BC.inputBorder}`,
          fontFamily: mono ? "ui-monospace, monospace" : "inherit",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = BC.pink;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = BC.inputBorder;
        }}
      />
    </label>
  );
}

function Sect({ children }: { children: string }) {
  return (
    <div className="mt-4 mb-2 border-t border-bc-line pt-3 text-[9px] font-bold uppercase tracking-[1.8px] text-[#3D3D3D]">
      {children}
    </div>
  );
}

function ToolBtn({
  onClick,
  icon,
  label,
  short,
  primary,
  disabled,
}: {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  short?: string;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-sm px-2.5 text-[10px] font-extrabold tracking-[1.4px] uppercase disabled:opacity-40 md:px-3"
      style={{
        background: primary ? BC.pink : "transparent",
        color: primary ? BC.white : BC.pink,
        border: `1px solid ${BC.pink}`,
      }}
    >
      {icon}
      <span className="whitespace-nowrap">{short ?? label}</span>
    </button>
  );
}
