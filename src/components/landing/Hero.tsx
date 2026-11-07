import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { t, type Locale } from "@/lib/i18n";
import { settings } from "@/lib/site";
import { ArrowUR, scrollToId, useFocusTrap, zBtn } from "./ui";

function useParallax(factor: number) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * (factor - 1)}px)`;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [factor]);
  return ref;
}

function Sticker({
  className,
  rotate,
  float,
  delay,
  parallax,
  children,
}: {
  className?: string;
  rotate: number;
  float: string;
  delay: number;
  parallax: number;
  children: React.ReactNode;
}) {
  const ref = useParallax(parallax);
  return (
    <div ref={ref} className={cn("absolute z-10", className)}>
      <div className="anim-pop" style={{ animationDelay: `${delay}ms` }}>
        <div className="max-sm:!animate-none anim-float" style={{ animationDuration: float, animationDelay: `-${delay}ms` }}>
          <div
            className="rounded-[10px] px-3 py-2 shadow-sticker transition-transform duration-300 hover:!rotate-0 hover:scale-[1.04] max-sm:scale-80"
            style={{ rotate: `${rotate}deg` }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function StickerA({ locale }: { locale: Locale }) {
  return (
    <div className="bg-pink text-sticker-ink rounded-[10px] -m-3 -my-2 px-3 py-2">
      <div className="font-display text-[22px] leading-none font-bold">{settings.stats.videos}</div>
      <div className="mt-1 text-[10px] leading-tight font-medium">{t(locale, "sticker.videos")}</div>
    </div>
  );
}
function StickerB({ locale }: { locale: Locale }) {
  return (
    <div className="-m-3 -my-2 flex items-center gap-1.5 rounded-[10px] bg-blue px-3 py-2 text-text">
      <span className="font-display text-[40px] leading-none font-bold">{settings.stats.years}</span>
      <span className="flex flex-col">
        <span className="font-display text-[18px] leading-none font-semibold">{t(locale, "sticker.years")}</span>
        <span className="mt-1 text-[10px] leading-tight font-medium">{t(locale, "sticker.yearsSub")}</span>
      </span>
    </div>
  );
}
function StickerC({ locale }: { locale: Locale }) {
  return (
    <div className="-m-3 -my-2 flex items-end gap-2 rounded-[10px] bg-yellow px-3 py-2 text-sticker-ink">
      <svg viewBox="0 0 20 18" width="22" height="20" aria-hidden="true" className="fill-sticker-ink">
        <rect x="0" y="10" width="3.5" height="8" rx="1" />
        <rect x="5.5" y="6" width="3.5" height="12" rx="1" />
        <rect x="11" y="3" width="3.5" height="15" rx="1" />
        <rect x="16.5" y="0" width="3.5" height="18" rx="1" />
      </svg>
      <span className="flex flex-col">
        <span className="text-[10px] leading-none font-medium">CTR</span>
        <span className="font-display text-[18px] leading-none font-bold whitespace-nowrap">{settings.stats.ctr[locale]}</span>
      </span>
    </div>
  );
}

export function Hero({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const trap = useFocusTrap(open, close);
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToId(id);
  };
  const lines = [t(locale, "hero.l1"), t(locale, "hero.l2"), t(locale, "hero.l3")];

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line pb-20">
      <img
        src="/zhan-logo.png"
        alt=""
        aria-hidden="true"
        className="anim-drift pointer-events-none absolute top-10 left-1/2 w-[1100px] max-w-none opacity-[.05] blur-[40px] select-none"
      />
      <div className="container-z relative pt-14">
        <div className="relative mx-auto max-w-[1100px] text-center">
          <p className="anim-rise mb-5 text-sm font-medium tracking-[0.02em] uppercase">{t(locale, "hero.eyebrow")}</p>
          <h1 id="hero-title" className="h1-hero">
            {lines.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <span className="anim-line block" style={{ animationDelay: `${80 + i * 60}ms` }}>
                  {l}
                </span>
              </span>
            ))}
          </h1>

          {/* Desktop sticker positions */}
          <Sticker className="right-[2%] top-[150px] max-sm:hidden lg:top-[190px] xl:-right-[70px] xl:top-[260px]" rotate={2} float="4.6s" delay={690} parallax={0.92}>
            <StickerB locale={locale} />
          </Sticker>
          <Sticker className="left-[-4%] top-[250px] max-sm:hidden lg:top-[300px] xl:left-[-15px] xl:top-[360px]" rotate={-3} float="5.4s" delay={600} parallax={1.08}>
            <StickerA locale={locale} />
          </Sticker>

          <p className="anim-rise mx-auto mt-7 max-w-[640px] text-base leading-[1.35] text-text/90 sm:text-lg xl:text-xl" style={{ animationDelay: "300ms" }}>
            {t(locale, "hero.lead1")} <br className="hidden sm:block" />
            {t(locale, "hero.lead2")}
          </p>

          {/* Mobile sticker row */}
          <div className="mt-5 flex justify-center gap-3 sm:hidden">
            <div className="-rotate-3 scale-90 rounded-[10px] px-3 py-2 shadow-sticker"><StickerA locale={locale} /></div>
            <div className="rotate-2 scale-90 rounded-[10px] px-3 py-2 shadow-sticker"><StickerB locale={locale} /></div>
          </div>

          <div className="anim-rise mt-7 flex flex-wrap justify-center gap-2.5" style={{ animationDelay: "380ms" }}>
            <a href="#contact" onClick={go("contact")} className={zBtn()}>
              {t(locale, "cta.discuss")} <ArrowUR />
            </a>
            <a href="#work" onClick={go("work")} className={zBtn({ variant: "ghost" })}>
              {t(locale, "cta.seeWork")}
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-8 w-full max-w-[760px] max-lg:max-w-[90%] max-sm:max-w-full xl:max-w-[1150px]">
          <div className="anim-reel" style={{ animationDelay: "450ms" }}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t(locale, "hero.play")}
              className="group relative block aspect-video w-full overflow-hidden rounded-[28px] border border-line bg-surface"
            >
              {settings.showreel.preview ? (
                <video
                  src={settings.showreel.preview}
                  poster={settings.showreel.poster || undefined}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover motion-reduce:hidden"
                />
              ) : settings.showreel.poster ? (
                <img src={settings.showreel.poster} alt="" className="absolute inset-0 size-full object-cover" />
              ) : null}
              <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.45))]" aria-hidden="true" />
            </button>
          </div>
          <Sticker className="-top-5 -right-4 sm:-top-6 sm:-right-12 2xl:-right-[170px]" rotate={1.5} float="5.9s" delay={780} parallax={1}>
            <StickerC locale={locale} />
          </Sticker>
        </div>
      </div>

      {open && (
        <div
          className="anim-fade fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, "hero.play")}
          ref={trap}
        >
          <button
            onClick={close}
            aria-label={t(locale, "nav.close")}
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-surface text-text"
          >
            <X className="size-5" strokeWidth={1.6} />
          </button>
          <div className="anim-reel aspect-video w-full max-w-[1100px] overflow-hidden rounded-[28px] bg-surface" onClick={(e) => e.stopPropagation()}>
            {/\.(mp4|webm)$/i.test(settings.showreel.full) ? (
              <video src={settings.showreel.full} controls autoPlay loop playsInline className="size-full bg-black object-contain" />
            ) : settings.showreel.full ? (
              <iframe
                src={settings.showreel.full}
                title="Showreel"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="size-full"
              />
            ) : (
              <div className="grid size-full place-items-center">
                <img src="/zhan-logo.png" alt="Zhan" className="h-20 opacity-60" />
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
