import { useEffect, useRef, useState, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const zBtn = cva(
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,border-color,transform] duration-150 active:scale-[.97] disabled:opacity-40 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-hot text-hot-ink hover:bg-hot-hover",
        ghost: "border border-line-strong text-text hover:bg-text/[.04] hover:border-text/25",
        ink: "bg-ink text-cream hover:bg-ink/85",
      },
      size: {
        md: "h-11 px-[22px] text-[15px]",
        sm: "h-10 px-5 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export type ZBtnProps = VariantProps<typeof zBtn>;

export function ArrowUR({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
        className,
      )}
    >
      <path d="M3 9 9 3M4 3h5v5" />
    </svg>
  );
}

export function QuoteMark() {
  return (
    <svg viewBox="0 0 28 22" width="26" height="20" aria-hidden="true" className="fill-hot">
      <path d="M0 22V12.6C0 5.6 3.4 1.4 10.2 0l1.4 3.2C8 4.4 6.2 6.8 6 10h5.4v12H0Zm16.4 0V12.6C16.4 5.6 19.8 1.4 26.6 0L28 3.2c-3.6 1.2-5.4 3.6-5.6 6.8h5.4v12H16.4Z" />
    </svg>
  );
}

export function FiverrMark() {
  return (
    <span className="font-display text-[26px] leading-none font-bold tracking-[-0.04em] text-fiverr">
      fiverr<span className="text-fiverr">.</span>
    </span>
  );
}

/** Fade-up when scrolled into view (once). */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", on && "is-in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/** Traps focus within a container while mounted; restores focus on unmount. */
export function useFocusTrap(active: boolean, onEsc: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    const sel = 'a[href],button:not([disabled]),iframe,input,select,textarea,[tabindex]:not([tabindex="-1"])';
    el?.querySelector<HTMLElement>(sel)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEsc();
      if (e.key !== "Tab" || !el) return;
      const items = Array.from(el.querySelectorAll<HTMLElement>(sel));
      if (!items.length) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const ov = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = ov;
      prev?.focus?.();
    };
  }, [active, onEsc]);
  return ref;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
