import type { ReactNode } from "react";
import {
  BC,
  MIX_COLS,
  MIX_MODULES,
  WAVE_A,
  WAVE_B,
  countMix,
  mixCountLabel,
  type KitId,
  type Layers,
  type Offset,
  type Slide1,
  type Slide2,
  type Slide3,
} from "@/lib/carousel";
import { OverlayBox } from "./overlay";

type Shared = {
  kit: KitId;
  mixOn: Record<string, boolean>;
  onToggleMix: (id: string) => void;
  layers: Layers;
  markSrc: string;
  photoSrc: string | null;
  bgSrc: string | null;
  offsets: Record<string, Offset>;
  selected: string | null;
  showOverlays: boolean;
  onSelect: (id: string) => void;
  onOffset: (id: string, next: Offset) => void;
};

function off(map: Record<string, Offset>, id: string): Offset {
  return map[id] ?? { x: 0, y: 0 };
}

function BrandMark({ src, size = 100 }: { src: string; size?: number }) {
  return (
    <img
      src={src}
      alt="Brand mark"
      width={size}
      height={size}
      className="object-contain"
      style={{ filter: "drop-shadow(0 0 12px rgba(255,43,138,0.6))" }}
      crossOrigin="anonymous"
    />
  );
}

function Waveform({
  heights,
  maxH,
  splitAt,
}: {
  heights: number[];
  maxH: number;
  splitAt?: number;
}) {
  const w = heights.length * 10;
  return (
    <svg width={w} height={maxH} viewBox={`0 0 ${w} ${maxH}`}>
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 10}
          y={(maxH - h) / 2}
          width={5.4}
          height={h}
          rx={1.1}
          fill={splitAt != null && i >= splitAt ? BC.lime : BC.pink}
          opacity={0.9}
        />
      ))}
    </svg>
  );
}

function DotGrid({ cols = 5, rows = 4, gap = 20, r = 3.5 }: { cols?: number; rows?: number; gap?: number; r?: number }) {
  const w = (cols - 1) * gap + r * 2;
  const h = (rows - 1) * gap + r * 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {Array.from({ length: rows }, (_, y) =>
        Array.from({ length: cols }, (_, x) => (
          <circle key={`${y}-${x}`} cx={x * gap + r} cy={y * gap + r} r={r} fill={BC.lime} />
        )),
      )}
    </svg>
  );
}

function PhotoLayer({ shared, id }: { shared: Shared; id: string }) {
  if (!shared.layers.photo || !shared.photoSrc) return null;
  return (
    <OverlayBox
      id={id}
      label="Photo"
      selected={shared.selected === id}
      show={shared.showOverlays}
      offset={off(shared.offsets, id)}
      onSelect={shared.onSelect}
      onOffset={shared.onOffset}
      className="inset-0"
    >
      <img
        src={shared.photoSrc}
        alt=""
        className="h-full w-full object-cover opacity-40"
        crossOrigin="anonymous"
      />
    </OverlayBox>
  );
}

export function SlideOne({ d, shared }: { d: Slide1; shared: Shared }) {
  const L = shared.layers;
  return (
    <SlideShell shared={shared}>
      {L.shapes ? (
        <>
          <svg className="absolute opacity-[0.18]" style={{ top: -120, right: -120 }} width={440} height={440} viewBox="0 0 440 440">
            <circle cx={220} cy={220} r={200} fill="none" stroke={BC.pink} strokeWidth={48} />
          </svg>
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 1080 1080" preserveAspectRatio="none">
            <line x1={0} y1={1080} x2={1080} y2={0} stroke={BC.pink} strokeWidth={1.2} />
          </svg>
        </>
      ) : null}

      <PhotoLayer shared={shared} id="s1-photo" />

      {L.text ? (
        <OverlayBox
          id="s1-num"
          label="Slide number"
          selected={shared.selected === "s1-num"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s1-num")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          className="flex items-center gap-3"
          style={{ top: "6.5%", left: "6.5%" }}
        >
          <div className="size-2.5 rounded-full border-[2.5px] border-bc-pink" />
          <span className="text-[1.7vh] font-bold tracking-[2px] text-bc-dim">{d.slideNum}</span>
          <div className="h-0.5 w-[90px] bg-linear-to-r from-bc-pink to-transparent" />
        </OverlayBox>
      ) : null}

      {L.brandMark ? (
        <OverlayBox
          id="s1-mark"
          label="Brand Mark"
          selected={shared.selected === "s1-mark"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s1-mark")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "3%", right: "5%" }}
        >
          <BrandMark src={shared.markSrc} />
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s1-title"
          label="Title"
          selected={shared.selected === "s1-title"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s1-title")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "17%", left: "6.5%" }}
        >
          <div
            className="font-black leading-none text-white"
            style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(44px,8.5vh,90px)", letterSpacing: "-2.5px" }}
          >
            {d.title}
          </div>
          <div
            className="mt-[0.3em] font-black leading-none text-bc-pink"
            style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(26px,5vh,55px)", letterSpacing: "-1.5px" }}
          >
            {d.subtitle}
          </div>
          {L.shapes ? <div className="mt-[0.5em] h-1.5 w-40 rounded-sm bg-bc-lime" /> : null}
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s1-body"
          label="Body"
          selected={shared.selected === "s1-body"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s1-body")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          className="max-w-[62%]"
          style={{ top: "38%", left: "6.5%" }}
        >
          {d.body.map((line, i) => (
            <div key={i}>
              {i > 0 && L.shapes ? (
                <div className="my-[0.55em] flex items-center gap-2">
                  <div className="h-px w-[18px] bg-bc-pink/50" />
                  <svg width={7} height={7} viewBox="0 0 7 7">
                    <rect x={0} y={3.5} width={4.95} height={4.95} rx={0.5} transform="rotate(-45 0 3.5)" fill={BC.pink} opacity={0.7} />
                  </svg>
                  <div className="h-px flex-1 bg-linear-to-r from-bc-pink/30 to-transparent" />
                </div>
              ) : null}
              <div
                className="font-medium leading-[1.45]"
                style={{ fontSize: "clamp(14px,2.2vh,24px)", color: i === 1 ? BC.lime : BC.white }}
              >
                {line}
              </div>
            </div>
          ))}
        </OverlayBox>
      ) : null}

      {L.waveform ? (
        <OverlayBox
          id="s1-wave"
          label="Waveform"
          selected={shared.selected === "s1-wave"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s1-wave")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ bottom: "17%", left: "6.5%" }}
        >
          <Waveform heights={WAVE_A} maxH={120} splitAt={55} />
        </OverlayBox>
      ) : null}

      {L.shapes ? (
        <>
          <OverlayBox
            id="s1-tri"
            label="Deco"
            selected={shared.selected === "s1-tri"}
            show={shared.showOverlays}
            offset={off(shared.offsets, "s1-tri")}
            onSelect={shared.onSelect}
            onOffset={shared.onOffset}
            className="flex items-center gap-4"
            style={{ bottom: "5%", left: "6.5%" }}
          >
            <svg width={56} height={28} viewBox="0 0 56 28">
              <polygon points="0,28 28,0 56,28" fill="none" stroke={BC.lime} strokeWidth={2.5} />
            </svg>
            <div className="h-0.5 w-12 rounded-sm bg-bc-lime" />
            <div className="size-2 rounded-full bg-bc-lime" />
          </OverlayBox>
          <OverlayBox
            id="s1-grid"
            label="Grid"
            selected={shared.selected === "s1-grid"}
            show={shared.showOverlays}
            offset={off(shared.offsets, "s1-grid")}
            onSelect={shared.onSelect}
            onOffset={shared.onOffset}
            style={{ bottom: "4%", right: "5%" }}
          >
            <DotGrid />
          </OverlayBox>
        </>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s1-foot"
          label="Footer"
          selected={shared.selected === "s1-foot"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s1-foot")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          className="flex w-[87%] items-center justify-between"
          style={{ bottom: "4.5%", left: "6.5%" }}
        >
          <span className="text-[clamp(10px,1.4vh,15px)] font-bold tracking-[1.8px] text-[#6A6A6A]">
            {d.footerLabel}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[clamp(10px,1.4vh,15px)] font-bold tracking-[1.8px] text-bc-pink">
              {d.footerSlide}
            </span>
            <div className="size-2 rounded-full bg-bc-lime" />
          </div>
        </OverlayBox>
      ) : null}
    </SlideShell>
  );
}

export function SlideTwo({ d, shared }: { d: Slide2; shared: Shared }) {
  const L = shared.layers;
  const isMix = shared.kit === "mix";
  return (
    <SlideShell shared={shared}>
      {L.shapes ? (
        <>
          <svg className="absolute opacity-[0.22]" style={{ right: -160, top: "30%" }} width={360} height={360} viewBox="0 0 360 360">
            <circle cx={180} cy={180} r={160} fill="none" stroke={BC.pink} strokeWidth={28} />
            <circle cx={180} cy={180} r={130} fill="none" stroke={BC.pink} strokeWidth={2} opacity={0.5} />
          </svg>
          <svg className="absolute inset-0 h-full w-full opacity-[0.04]" viewBox="0 0 1080 1080" preserveAspectRatio="none">
            {[200, 350, 500, 650, 800].map((y) => (
              <line key={y} x1={0} y1={y} x2={1080} y2={y} stroke={BC.white} strokeWidth={1} />
            ))}
          </svg>
        </>
      ) : null}

      <PhotoLayer shared={shared} id="s2-photo" />

      {L.text && !isMix ? (
        <OverlayBox
          id="s2-num"
          label="Slide number"
          selected={shared.selected === "s2-num"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s2-num")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "6%", left: "6.5%" }}
        >
          <span className="text-[1.8vh] font-bold tracking-[2px] text-bc-pink">{d.slideNum}</span>
          <div className="mt-1.5 h-[5px] w-14 rounded-sm bg-bc-lime" />
        </OverlayBox>
      ) : null}

      {L.brandMark && !isMix ? (
        <OverlayBox
          id="s2-mark"
          label="Brand Mark"
          selected={shared.selected === "s2-mark"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s2-mark")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "3%", right: "5%" }}
        >
          <BrandMark src={shared.markSrc} />
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s2-title"
          label="Heading"
          selected={shared.selected === "s2-title"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s2-title")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: isMix ? "2.4%" : "16%", left: "5.5%" }}
        >
          {isMix ? (
            <div className="flex items-center gap-[0.45em]" style={{ fontSize: "clamp(12px, 2.15vh, 26px)" }}>
              <span className="shrink-0 text-[0.42em] font-bold tracking-[0.16em] text-bc-pink">
                {d.slideNum}
              </span>
              <div className="h-[0.12em] w-[0.7em] shrink-0 rounded-sm bg-bc-lime" />
              <div
                className="font-black leading-none"
                style={{ fontFamily: "Arial Black, Impact, sans-serif", letterSpacing: "-0.04em" }}
              >
                <span className="text-white">{d.h1} </span>
                <span className="text-bc-lime">{d.h2}</span>
              </div>
              <span className="font-mono text-[0.72em] font-bold leading-none text-bc-lime">
                {countMix(shared.mixOn)}/{MIX_MODULES.length}
              </span>
            </div>
          ) : (
            <>
              <div
                className="font-black leading-none text-white"
                style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(44px,8.5vh,90px)", letterSpacing: "-2.5px" }}
              >
                {d.h1}
              </div>
              <div
                className="font-black leading-none text-bc-lime"
                style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(44px,8.5vh,90px)", letterSpacing: "-2.5px" }}
              >
                {d.h2}
              </div>
            </>
          )}
        </OverlayBox>
      ) : null}

      {L.text ? (
        isMix ? (
          <OverlayBox
            id="s2-list"
            label="Mix list"
            selected={shared.selected === "s2-list"}
            show={shared.showOverlays}
            offset={off(shared.offsets, "s2-list")}
            onSelect={shared.onSelect}
            onOffset={shared.onOffset}
            style={{ top: "max(34px, 8.6%)", left: "4.5%", width: "91%", height: "calc(96.5% - max(34px, 8.6%))" }}
          >
            <MixChecklist mixOn={shared.mixOn} onToggle={shared.onToggleMix} />
          </OverlayBox>
        ) : (
          <OverlayBox
            id="s2-list"
            label="List"
            selected={shared.selected === "s2-list"}
            show={shared.showOverlays}
            offset={off(shared.offsets, "s2-list")}
            onSelect={shared.onSelect}
            onOffset={shared.onOffset}
            className="max-w-[78%]"
            style={{ top: "42%", left: "6.5%" }}
          >
            {d.items.map((item, i) => (
              <div key={i} className="mb-[1.1em] flex items-start gap-3">
                <span className="mt-1 font-mono text-[11px] font-bold tracking-widest text-bc-pink">
                  0{i + 1}
                </span>
                <div>
                  <div className="mb-1.5 h-px w-10 bg-bc-lime" />
                  <div className="text-[clamp(16px,2.4vh,26px)] font-medium leading-snug text-white">{item}</div>
                </div>
              </div>
            ))}
          </OverlayBox>
        )
      ) : null}

      {L.waveform && !isMix ? (
        <OverlayBox
          id="s2-wave"
          label="Waveform"
          selected={shared.selected === "s2-wave"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s2-wave")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ bottom: "8%", left: "6.5%" }}
        >
          <Waveform heights={WAVE_B} maxH={80} />
        </OverlayBox>
      ) : null}
    </SlideShell>
  );
}

function MixChecklist({
  mixOn,
  onToggle,
}: {
  mixOn: Record<string, boolean>;
  onToggle?: (id: string) => void;
}) {
  const byGroup = new Map<string, typeof MIX_MODULES>();
  for (const m of MIX_MODULES) {
    const arr = byGroup.get(m.group) ?? [];
    arr.push(m);
    byGroup.set(m.group, arr);
  }

  return (
    <div
      className="grid h-full min-h-0 grid-cols-3 overflow-hidden text-[12.5px] max-md:text-[7px]"
      style={{ columnGap: "2.2%" }}
    >
      {MIX_COLS.map((groups, ci) => (
        <div
          key={groups.join("-")}
          className="min-w-0"
          style={{
            borderLeft: ci === 0 ? undefined : `1px solid ${BC.pink}28`,
            paddingLeft: ci === 0 ? 0 : "7%",
          }}
        >
          {groups.map((g) => (
            <div key={g} className="mb-[0.7em]">
              <div
                className="mb-[0.38em] flex items-center gap-[0.4em] font-extrabold tracking-[0.18em] text-bc-pink"
                style={{ fontSize: "0.72em" }}
              >
                <span className="inline-block size-[0.55em] shrink-0 bg-bc-lime" />
                {g}
              </div>
              {(byGroup.get(g) ?? []).map((m) => {
                const on = !!mixOn[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle?.(m.id);
                    }}
                    className="mb-[0.18em] flex h-auto w-full min-w-0 items-center gap-[0.42em] overflow-hidden p-0 text-left leading-none whitespace-nowrap"
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className="flex shrink-0 items-center justify-center overflow-hidden"
                      style={{
                        width: "0.95em",
                        height: "0.95em",
                        border: `1.5px solid ${on ? BC.lime : BC.pink}`,
                        background: on ? BC.lime : "transparent",
                      }}
                    >
                      {on ? (
                        <svg viewBox="0 0 12 12" className="h-[0.78em] w-[0.78em]" aria-hidden>
                          <path
                            d="M2 6.4 4.8 9.2 10 3"
                            fill="none"
                            stroke="#050505"
                            strokeWidth="2.2"
                            strokeLinecap="square"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <span
                      className="min-w-0 truncate leading-none"
                      style={{
                        fontSize: "0.82em",
                        fontWeight: 500,
                        color: on ? BC.white : "#555555",
                        letterSpacing: "0.01em",
                      }}
                    >
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SlideThree({ d, shared }: { d: Slide3; shared: Shared }) {
  const L = shared.layers;
  const rows =
    shared.kit === "mix" ? [mixCountLabel(shared.mixOn), ...d.rows.slice(1)] : d.rows;
  return (
    <SlideShell shared={shared}>
      {L.shapes ? (
        <>
          <svg className="absolute opacity-20" style={{ left: -140, bottom: -80 }} width={380} height={380} viewBox="0 0 380 380">
            <circle cx={190} cy={190} r={170} fill="none" stroke={BC.lime} strokeWidth={22} />
          </svg>
          <svg className="absolute inset-0 h-full w-full opacity-[0.05]" viewBox="0 0 1080 1080" preserveAspectRatio="none">
            <line x1={0} y1={0} x2={1080} y2={1080} stroke={BC.pink} strokeWidth={1} />
          </svg>
        </>
      ) : null}

      <PhotoLayer shared={shared} id="s3-photo" />

      {L.text ? (
        <OverlayBox
          id="s3-num"
          label="Slide number"
          selected={shared.selected === "s3-num"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-num")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "6%", left: "6.5%" }}
        >
          <span className="text-[1.8vh] font-bold tracking-[2px] text-bc-dim">{d.slideNum}</span>
          <div className="mt-1.5 h-[5px] w-14 rounded-sm bg-bc-pink" />
        </OverlayBox>
      ) : null}

      {L.brandMark ? (
        <OverlayBox
          id="s3-mark"
          label="Brand Mark"
          selected={shared.selected === "s3-mark"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-mark")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "3%", right: "5%" }}
        >
          <BrandMark src={shared.markSrc} />
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s3-title"
          label="Heading"
          selected={shared.selected === "s3-title"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-title")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ top: "16%", left: "6.5%" }}
        >
          <div
            className="font-black leading-none text-white"
            style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(40px,7.5vh,80px)", letterSpacing: "-2px" }}
          >
            {d.h1}{" "}
            <span className="text-bc-lime">&</span>
          </div>
          <div
            className="font-black leading-none text-bc-pink"
            style={{ fontFamily: "Arial Black, Impact, sans-serif", fontSize: "clamp(40px,7.5vh,80px)", letterSpacing: "-2px" }}
          >
            {d.h2}
          </div>
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s3-rows"
          label="Price rows"
          selected={shared.selected === "s3-rows"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-rows")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          className="w-[87%]"
          style={{ top: "42%", left: "6.5%" }}
        >
          {rows.map((row, i) => (
            <div key={i} className="mb-3 flex items-end justify-between border-b border-white/10 pb-2">
              <span className="text-[clamp(13px,2vh,20px)] font-medium text-bc-dim">{row.label}</span>
              <span className="font-mono text-[clamp(16px,2.6vh,28px)] font-bold text-bc-lime">{row.value}</span>
            </div>
          ))}
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s3-cta"
          label="CTA"
          selected={shared.selected === "s3-cta"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-cta")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ bottom: "16%", left: "6.5%" }}
        >
          <div
            className="inline-block border-2 border-bc-pink px-5 py-2.5 text-[clamp(12px,1.8vh,16px)] font-extrabold tracking-[1.8px] text-bc-pink"
          >
            {d.cta}
          </div>
        </OverlayBox>
      ) : null}

      {L.waveform ? (
        <OverlayBox
          id="s3-wave"
          label="Waveform"
          selected={shared.selected === "s3-wave"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-wave")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ bottom: "9%", right: "6%" }}
        >
          <Waveform heights={WAVE_B.slice(0, 18)} maxH={48} splitAt={9} />
        </OverlayBox>
      ) : null}

      {L.text ? (
        <OverlayBox
          id="s3-foot"
          label="Footer"
          selected={shared.selected === "s3-foot"}
          show={shared.showOverlays}
          offset={off(shared.offsets, "s3-foot")}
          onSelect={shared.onSelect}
          onOffset={shared.onOffset}
          style={{ bottom: "4.5%", left: "6.5%" }}
        >
          <span className="text-[clamp(12px,1.8vh,18px)] font-bold tracking-[1.6px] text-bc-dim">{d.footer}</span>
          <div className="mt-1 h-[3px] rounded-sm bg-bc-pink" />
        </OverlayBox>
      ) : null}
    </SlideShell>
  );
}

function SlideShell({ shared, children }: { shared: Shared; children: ReactNode }) {
  const L = shared.layers;
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        containerType: "size",
        background: L.background
          ? shared.bgSrc
            ? `center / cover no-repeat url(${shared.bgSrc}), ${BC.bg}`
            : BC.bg
          : "transparent",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
