import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "group flex flex-col items-center px-2 py-1 no-underline sm:px-3",
        className,
      )}
      title="NAMENLOS tattoo Viktoriia"
      aria-label="NAMENLOS tattoo Viktoriia"
    >
      <span className="font-display text-[1.05rem] font-semibold leading-none tracking-[0.12em] text-fg group-hover:text-yellow sm:text-[1.38rem] sm:tracking-[0.16em]">
        NAMENLOS{" "}
        <span className="text-yellow">TATTOO</span>
      </span>
      <span className="mt-1 h-px w-20 bg-yellow/85 sm:w-24" aria-hidden />
      <span className="mt-1 font-display text-[0.58rem] font-medium tracking-[0.38em] text-yellow sm:text-[0.62rem] sm:tracking-[0.46em]">
        VIKTORIIA
      </span>
    </Link>
  );
}
