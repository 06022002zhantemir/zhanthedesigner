import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { t, type Locale } from "@/lib/i18n";
import { CATEGORIES, projects, type Category, type Project } from "@/lib/site";
import { ArrowUR, Reveal, scrollToId, useFocusTrap, zBtn } from "./ui";

type Filter = "all" | Category;
const PAGE = 6;

export function setWorkFilter(f: Filter) {
  window.dispatchEvent(new CustomEvent("zhan:filter", { detail: f }));
}

function readFilter(): Filter {
  const f = new URLSearchParams(window.location.search).get("filter");
  return f && (CATEGORIES as string[]).includes(f) ? (f as Category) : "all";
}

export function Work({ locale, onReference }: { locale: Locale; onReference: (slug: string) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [limit, setLimit] = useState(PAGE);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  useEffect(() => {
    setFilter(readFilter());
    const fromHash = () => {
      const m = window.location.hash.match(/^#case\/(.+)$/);
      setOpenSlug(m?.[1] ?? null);
    };
    fromHash();
    const onF = (e: Event) => apply((e as CustomEvent<Filter>).detail);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("zhan:filter", onF);
    window.addEventListener("popstate", () => setFilter(readFilter()));
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("zhan:filter", onF);
    };
  }, []);

  const apply = (f: Filter) => {
    setFilter(f);
    setLimit(PAGE);
    const u = new URL(window.location.href);
    if (f === "all") u.searchParams.delete("filter");
    else u.searchParams.set("filter", f);
    window.history.replaceState(null, "", u.pathname + u.search + u.hash);
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const k of CATEGORIES) c[k] = projects.filter((p) => p.categories.includes(k)).length;
    return c;
  }, []);
  const list = useMemo(
    () => [...projects].sort((a, b) => a.order - b.order).filter((p) => filter === "all" || p.categories.includes(filter)),
    [filter],
  );
  const shown = list.slice(0, limit);

  const openCase = (slug: string) => {
    window.history.pushState(null, "", `${window.location.pathname}${window.location.search}#case/${slug}`);
    setOpenSlug(slug);
  };
  const closeCase = useCallback(() => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setOpenSlug(null);
  }, []);
  const current = openSlug ? list.find((p) => p.slug === openSlug) ?? projects.find((p) => p.slug === openSlug) : undefined;

  return (
    <section id="work" aria-labelledby="work-title" className="section-pad">
      <div className="container-z">
        <h2 id="work-title" className="h2-section">{t(locale, "work.title")}</h2>
        <div className="mt-3 flex flex-col gap-5 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between">
          <p className="text-text-muted">{t(locale, "work.sub")}</p>
          <div
            role="toolbar"
            aria-label={t(locale, "work.filter")}
            className="no-scrollbar edge-fade -mx-4 flex gap-2 overflow-x-auto px-4 min-[900px]:mx-0 min-[900px]:px-0 min-[900px]:[mask-image:none]"
          >
            {(["all", ...CATEGORIES] as Filter[])
              .filter((f) => (counts[f] ?? 0) > 0)
              .map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  onClick={() => apply(f)}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-4 text-sm transition-colors",
                    filter === f ? "bg-chip font-semibold text-chip-ink" : "border border-line-strong hover:bg-text/[.04]",
                  )}
                >
                  {t(locale, f === "all" ? "filter.all" : `filter.${f}`)}
                </button>
              ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{t(locale, "work.shown", { n: list.length })}</p>

        {list.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted">{t(locale, "work.empty")}</p>
            <button onClick={() => apply("all")} className={cn(zBtn({ variant: "ghost" }), "mt-5")}>{t(locale, "work.showAll")}</button>
          </div>
        ) : (
          <ul key={filter} className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <li key={p.id} className="anim-rise" style={{ animationDelay: `${i * 40}ms`, animationDuration: "400ms" }}>
                <ProjectCard p={p} locale={locale} onOpen={() => openCase(p.slug)} />
              </li>
            ))}
          </ul>
        )}
        {list.length > limit && (
          <div className="mt-12 text-center">
            <button onClick={() => setLimit((l) => l + PAGE)} className={zBtn({ variant: "ghost" })}>{t(locale, "work.more")}</button>
          </div>
        )}
      </div>

      {current && (
        <CaseModal
          key={current.slug}
          p={current}
          locale={locale}
          list={list.length ? list : projects}
          onClose={closeCase}
          onNav={openCase}
          onCta={() => {
            onReference(current.slug);
            closeCase();
            setTimeout(() => scrollToId("contact"), 50);
          }}
        />
      )}
    </section>
  );
}

function ProjectCard({ p, locale, onOpen }: { p: Project; locale: Locale; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block w-full text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line bg-surface">
        <div className={cn("absolute inset-0 transition-transform duration-[400ms] ease-out", !p.layers && "group-hover:scale-[1.03]")}>
          {p.layers ? (
            <>
              <img
                src={p.layers.bg}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full scale-[1.08] object-cover transition-transform duration-500 ease-out group-hover:scale-100"
              />
              <img
                src={p.layers.fg}
                alt={`${p.title[locale]} — ${p.caption[locale]}`}
                loading="lazy"
                className="absolute top-[6.5%] left-1/2 w-[72%] max-w-none -translate-x-1/2 origin-bottom transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
            </>
          ) : p.bgVideo ? (
            <>
              <video
                src={p.bgVideo}
                autoPlay
                muted
                loop
                playsInline
                onLoadedMetadata={(e) => {
                  if (p.bgClip) e.currentTarget.currentTime = p.bgClip[0];
                }}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (p.bgClip && (v.currentTime >= p.bgClip[1] || v.currentTime < p.bgClip[0])) v.currentTime = p.bgClip[0];
                }}
                aria-hidden="true"
                className="absolute inset-0 size-full scale-125 object-cover"
                style={{ filter: `blur(${p.bgBlur ?? 35}px)` }}
              />
              {p.logo && (
                <img
                  src={p.logo}
                  alt={p.title[locale]}
                  className="absolute top-1/2 left-1/2 max-w-none -translate-1/2"
                  style={{ width: `${p.logoWidth ?? 65}%` }}
                />
              )}
            </>
          ) : p.cover ? (
            <img src={p.cover} alt={`${p.title[locale]} — ${p.caption[locale]}`} loading="lazy" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-[radial-gradient(circle_at_70%_20%,var(--z-surface-hover),transparent_60%)]" />
          )}
          {p.previewVideo && hover && (
            <video src={p.previewVideo} autoPlay muted loop playsInline className="anim-fade absolute inset-0 size-full object-cover" />
          )}
        </div>
        <span className="tag-glass absolute top-3 left-3 inline-flex h-6 items-center rounded-full px-2.5 text-[11px]">
          {t(locale, `filter.${p.categories[0] ?? "ads"}`)}
        </span>
        <span className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-text text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUR />
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold sm:text-xl">{p.title[locale]}</h3>
      <p className="mt-1 text-sm text-text-muted">{p.caption[locale]}</p>
    </button>
  );
}

function CaseModal({
  p,
  locale,
  list,
  onClose,
  onNav,
  onCta,
}: {
  p: Project;
  locale: Locale;
  list: Project[];
  onClose: () => void;
  onNav: (slug: string) => void;
  onCta: () => void;
}) {
  const trap = useFocusTrap(true, onClose);
  const i = Math.max(0, list.findIndex((x) => x.slug === p.slug));
  const prev = list[(i - 1 + list.length) % list.length]!;
  const next = list[(i + 1) % list.length]!;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onNav(prev.slug);
      if (e.key === "ArrowRight") onNav(next.slug);
    };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [prev, next, onNav]);
  const vertical = p.video?.aspect === "9:16";

  if (p.modal === "showcase") return <ShowcaseModal p={p} locale={locale} trap={trap} onClose={onClose} onCta={onCta} />;

  return (
    <div className="anim-fade fixed inset-0 z-[70] bg-black/85 backdrop-blur-md sm:grid sm:place-items-center sm:p-6" onClick={onClose}>
      <div
        ref={trap}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        onClick={(e) => e.stopPropagation()}
        className="anim-reel relative h-full w-full overflow-y-auto bg-bg sm:h-auto sm:max-h-[90vh] sm:max-w-[960px] sm:rounded-[28px] sm:border sm:border-line"
      >
        <div className="sticky top-0 z-10 flex justify-end p-3">
          <button onClick={onClose} aria-label={t(locale, "nav.close")} className="grid size-11 place-items-center rounded-full bg-surface">
            <X className="size-5" strokeWidth={1.6} />
          </button>
        </div>
        <div className="-mt-14 px-5 pb-8 sm:px-10 sm:pb-10">
          <div className={cn("mx-auto overflow-hidden rounded-[20px] border border-line bg-surface", vertical ? "aspect-[9/16] max-h-[80vh]" : "aspect-video")}>
            {p.video?.src ? (
              p.video.provider === "file" ? (
                <video src={p.video.src} controls loop playsInline className="size-full" />
              ) : (
                <iframe src={p.video.src} title={p.title[locale]} allow="autoplay; fullscreen" allowFullScreen className="size-full" />
              )
            ) : (
              <div className="grid size-full place-items-center font-display text-6xl font-bold text-text/[.05]">{p.title[locale]}</div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <h3 id="case-title" className="font-display text-2xl font-semibold">{p.title[locale]}</h3>
            {p.client && <span className="text-text-muted">· {p.client}</span>}
            {p.year && <span className="text-text-muted">· {p.year}</span>}
            <span className="flex gap-2">
              {p.categories.map((c) => (
                <span key={c} className="rounded-full border border-line-strong px-2.5 py-1 text-[11px]">{t(locale, `filter.${c}`)}</span>
              ))}
            </span>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(["task", "solution", "result"] as const).map((k) => (
              <div key={k} className="rounded-[20px] border border-line bg-surface p-5">
                <p className="text-sm font-medium tracking-[0.02em] text-text-muted uppercase">{t(locale, `case.${k}`)}</p>
                <p className="mt-3">{p[k][locale]}</p>
                {k === "result" &&
                  p.metrics?.map((m) => (
                    <p key={m.value} className="mt-4 font-display text-2xl font-bold text-hot">
                      {m.label[locale]} {m.value}
                    </p>
                  ))}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <button onClick={() => onNav(prev.slug)} aria-label={t(locale, "case.prev")} className={cn(zBtn({ variant: "ghost" }), "w-11 px-0")}>
                <ChevronLeft className="size-5" strokeWidth={1.6} />
              </button>
              <button onClick={() => onNav(next.slug)} aria-label={t(locale, "case.next")} className={cn(zBtn({ variant: "ghost" }), "w-11 px-0")}>
                <ChevronRight className="size-5" strokeWidth={1.6} />
              </button>
            </div>
            <button onClick={onCta} className={zBtn()}>
              {t(locale, "case.cta")} <ArrowUR />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// A stillframe can be an image/GIF or a short muted looping video.
// Videos only play when `play` is set; otherwise they show their first frame.
function StillMedia({ src, className, play, controls }: { src: string; className?: string; play?: boolean; controls?: boolean }) {
  return /\.(mp4|webm)$/i.test(src) ? (
    <video
      src={play ? src : `${src}#t=0.1`}
      ref={(v) => {
        if (v && !play) v.pause();
      }}
      autoPlay={play}
      muted
      loop
      playsInline
      preload="metadata"
      controls={controls}
      className={className}
    />
  ) : (
    <img src={src} alt="" loading="lazy" className={className} />
  );
}

function ShowcaseModal({
  p,
  locale,
  trap,
  onClose,
  onCta,
}: {
  p: Project;
  locale: Locale;
  trap: React.Ref<HTMLDivElement>;
  onClose: () => void;
  onCta: () => void;
}) {
  const stills = p.stills ?? [];
  const [still, setStill] = useState<number | null>(null); // null = video
  const video = useRef<HTMLVideoElement>(null);
  const media = useRef<HTMLDivElement>(null);

  // Autoplay with sound; if the browser blocks it, fall back to muted.
  useEffect(() => {
    const v = video.current;
    v?.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    if (still !== null) media.current?.querySelectorAll("video").forEach((v) => v.pause());
  }, [still]);

  const step = useCallback((d: number) => setStill((s) => ((s ?? 0) + d + stills.length) % stills.length), [stills.length]);

  // While a stillframe is open, ←/→ flip frames instead of switching projects.
  useEffect(() => {
    if (still === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.stopPropagation();
      step(e.key === "ArrowLeft" ? -1 : 1);
    };
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  }, [still, step]);

  const glassBtn =
    "grid place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-black/70";

  return (
    <div className="anim-fade fixed inset-0 z-[70] grid place-items-center bg-black/85 p-4 backdrop-blur-md sm:p-6" onClick={onClose}>
      <div
        ref={trap}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        onClick={(e) => e.stopPropagation()}
        className="anim-reel relative grid max-h-[92vh] w-full max-w-[1145px] gap-8 overflow-y-auto rounded-[32px] border border-line bg-bg p-5 sm:rounded-[40px] sm:p-[42px] md:grid-cols-[619fr_407fr] md:gap-[37px]"
      >
        <div className="min-w-0">
          <div
            ref={media}
            className={cn(
              "relative",
              p.clips
                ? "flex gap-2.5"
                : cn("overflow-hidden rounded-[28px] bg-[#262a2a]", p.framed ? "grid aspect-[619/350] place-items-center" : "aspect-video"),
            )}
          >
            {p.clips?.map((c) => (
              <video
                key={c.src}
                src={c.src}
                controls
                autoPlay
                muted
                loop
                playsInline
                style={{ aspectRatio: `${c.w}/${c.h}`, flex: `${c.w / c.h} 1 0` }}
                className={cn("min-w-0 rounded-[28px] bg-black object-cover", still !== null && "invisible")}
              />
            ))}
            {!p.clips && p.video?.src && (
              <video
                ref={video}
                src={p.video.src}
                loop
                controls
                playsInline
                className={cn(
                  "bg-black object-cover",
                  p.framed ? "aspect-video w-[83%] rounded-lg" : "size-full",
                  still !== null && "invisible",
                )}
              />
            )}

            {still !== null && (
              <div className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#262a2a]">
                <StillMedia key={still} src={stills[still]!} play controls className="anim-fade absolute inset-0 size-full object-contain" />
                <span className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 font-mono text-[11px] text-white backdrop-blur-md">
                  {String(still + 1).padStart(2, "0")} / {String(stills.length).padStart(2, "0")}
                </span>
                <button onClick={() => setStill(null)} className={cn(glassBtn, "absolute top-4 right-4 flex h-9 gap-1.5 px-3.5 text-xs")}>
                  <Play className="size-3 fill-current" strokeWidth={0} /> {t(locale, "case.video")}
                </button>
                <button onClick={() => step(-1)} aria-label={t(locale, "case.prevStill")} className={cn(glassBtn, "absolute top-1/2 left-4 size-11 -translate-y-1/2")}>
                  <ChevronLeft className="size-5" strokeWidth={1.8} />
                </button>
                <button onClick={() => step(1)} aria-label={t(locale, "case.nextStill")} className={cn(glassBtn, "absolute top-1/2 right-4 size-11 -translate-y-1/2")}>
                  <ChevronRight className="size-5" strokeWidth={1.8} />
                </button>
              </div>
            )}
          </div>

          {stills.length > 0 && (
            <>
              <p className="mt-5 text-xs text-text-muted">{t(locale, "case.stills")}</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {stills.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setStill(i)}
                    aria-label={`${t(locale, "case.stills")} ${i + 1}`}
                    aria-pressed={still === i}
                    className={cn(
                      "aspect-video overflow-hidden rounded-[12px] bg-[#262a2a] transition-[opacity,box-shadow] duration-200",
                      still === i ? "opacity-100 ring-2 ring-hot ring-offset-2 ring-offset-bg" : "opacity-75 hover:opacity-100",
                    )}
                  >
                    <StillMedia key={String(still === i)} src={src} play={still === i} className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {p.categories.map((c) => (
                <span key={c} className="rounded-full bg-chip px-4 py-1.5 text-[11px] text-chip-ink">{t(locale, `filter.${c}`)}</span>
              ))}
              {p.year && <span className="rounded-full border border-line-strong px-4 py-1.5 text-[11px]">{p.year}</span>}
            </div>
            <div className="flex items-center gap-3 sm:-mt-4 sm:-mr-2">
              <span className="hidden text-xs text-text-muted sm:inline">Esc</span>
              <button onClick={onClose} aria-label={t(locale, "nav.close")} className="grid size-10 place-items-center rounded-full border border-line-strong hover:bg-text/[.04]">
                <X className="size-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          <h3 id="case-title" className="mt-5 font-display text-4xl font-semibold tracking-[-0.03em] sm:text-[40px] sm:leading-none">{p.title[locale]}</h3>
          <p className="mt-3 text-sm text-text-muted">{p.caption[locale]}</p>
          {p.tools && (
            <div className="mt-4 flex flex-wrap gap-1">
              {p.tools.map((tool) => (
                <span key={tool} className="rounded-md border border-line-strong px-2 py-1.5 text-[11px] whitespace-nowrap">{tool}</span>
              ))}
            </div>
          )}

          {p.story &&
            (["task", "solution"] as const).map((k) => (
              <div key={k} className="mt-6">
                <h4 className="text-lg font-medium">{t(locale, `case.${k}`)}</h4>
                <p className="mt-2 text-[13px] leading-[1.5] whitespace-pre-line text-text/85">{p[k][locale]}</p>
              </div>
            ))}

          <div className="min-h-8 flex-1" />
          <button onClick={onCta} className={cn(zBtn(), "h-[50px] w-full shrink-0")}>
            {t(locale, "case.cta")} <ArrowUR />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useRevealStub() {
  return Reveal;
}
