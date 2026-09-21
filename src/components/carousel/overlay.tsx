import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { BC, type Offset } from "@/lib/carousel";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  label: string;
  selected: boolean;
  show: boolean;
  offset: Offset;
  onSelect: (id: string) => void;
  onOffset: (id: string, next: Offset) => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export function OverlayBox({
  id,
  label,
  selected,
  show,
  offset,
  onSelect,
  onOffset,
  className,
  style,
  children,
}: Props) {
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    onSelect(id);
    if (!show) return;
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    const parent = e.currentTarget.offsetParent as HTMLElement | null;
    const w = parent?.clientWidth || 1;
    const h = parent?.clientHeight || 1;
    const dx = ((e.clientX - drag.current.x) / w) * 100;
    const dy = ((e.clientY - drag.current.y) / h) * 100;
    onOffset(id, {
      x: drag.current.ox + dx,
      y: drag.current.oy + dy,
    });
  }

  function onPointerUp() {
    drag.current = null;
  }

  return (
    <div
      className={cn("absolute", className)}
      style={{
        ...style,
        transform: `translate(${offset.x}%, ${offset.y}%)`,
        outline: show && selected ? `1.5px solid ${BC.pink}` : undefined,
        outlineOffset: 4,
        cursor: show ? "move" : "default",
        zIndex: selected ? 20 : undefined,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
      {show ? (
        <div data-overlay="1" className="pointer-events-none">
          {selected ? (
            <>
              {CORNERS.map((c) => (
                <span
                  key={c.k}
                  className="absolute size-1.5 bg-bc-pink"
                  style={c.style}
                />
              ))}
              <span
                className="absolute -top-5 left-0 whitespace-nowrap bg-bc-pink px-1.5 py-px text-[9px] font-bold tracking-widest text-white uppercase"
              >
                {label}
              </span>
            </>
          ) : (
            <span className="absolute -top-4 left-0 text-[8px] font-bold tracking-widest text-bc-pink/70 uppercase">
              {label}
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}

const CORNERS = [
  { k: "tl", style: { top: -3, left: -3 } },
  { k: "tr", style: { top: -3, right: -3 } },
  { k: "bl", style: { bottom: -3, left: -3 } },
  { k: "br", style: { bottom: -3, right: -3 } },
] as const;
