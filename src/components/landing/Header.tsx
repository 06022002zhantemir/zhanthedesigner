import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { LOCALES, localePath, t, type Locale } from "@/lib/i18n";
import { ArrowUR, scrollToId, useFocusTrap, zBtn } from "./ui";

const SECTIONS = ["work", "services", "reviews", "faq"] as const;

export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const navigate = useNavigate();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = LOCALES.indexOf(locale);
  const go = (l: Locale) => {
    if (l === locale) return;
    try {
      localStorage.setItem("zhan_lang", l);
    } catch {}
    const y = window.scrollY;
    const search = window.location.search;
    navigate({ to: localePath[l], resetScroll: false }).then(() => {
      if (search) window.history.replaceState(null, "", localePath[l] + search);
      window.scrollTo(0, y);
    });
  };
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn("relative grid h-8 grid-cols-3 rounded-full border border-line-strong p-[3px]", className)}
    >
      <span
        aria-hidden="true"
        className="absolute top-[3px] bottom-[3px] left-[3px] w-[calc((100%-6px)/3)] rounded-full bg-chip transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {LOCALES.map((l, i) => (
        <button
          key={l}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="radio"
          aria-checked={l === locale}
          tabIndex={l === locale ? 0 : -1}
          onClick={() => go(l)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
              e.preventDefault();
              const n = (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
              refs.current[n]?.focus();
              go(LOCALES[n]!);
            }
          }}
          className={cn(
            "relative z-10 min-w-8 rounded-full px-2 text-[11px] font-medium uppercase transition-colors",
            l === locale ? "font-semibold text-chip-ink" : "text-text-muted hover:text-text",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  return <img src="/zhan-logo.png" alt="Zhan" width={56} height={36} className={cn("h-9 w-auto", className)} />;
}

export function Header({ locale }: { locale: Locale }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mini, setMini] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 600 && y > last + 2 ? true : y < last - 2 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    ["top", ...SECTIONS, "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // mini CTA: after hero, hidden while contact in view
  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    let pastHero = false;
    let inContact = false;
    const upd = () => setMini(pastHero && !inContact);
    const io = new IntersectionObserver((es) => {
      for (const e of es) {
        if (e.target === hero) pastHero = !e.isIntersecting;
        if (e.target === contact) inContact = e.isIntersecting;
      }
      upd();
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const trapRef = useFocusTrap(open, close);

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
    history.replaceState(null, "", `#${id}`);
  };

  const NavLink = ({ id }: { id: (typeof SECTIONS)[number] }) => (
    <a
      href={`#${id}`}
      onClick={jump(id)}
      className={cn(
        "group relative py-2 text-[13px] transition-opacity xl:text-[15px]",
        active === id ? "opacity-100" : "opacity-80 hover:opacity-100",
      )}
    >
      {t(locale, `nav.${id}`)}
      <span className="absolute bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-text transition-transform duration-[180ms] group-hover:scale-x-100" />
      {active === id && (
        <span className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-hot" aria-hidden="true" />
      )}
    </a>
  );

  return (
    <>
      <a
        href="#main"
        className="fixed top-2 left-2 z-[60] -translate-y-20 rounded-full bg-hot px-4 py-2 text-sm text-hot-ink focus:translate-y-0"
      >
        {t(locale, "skip")}
      </a>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-line transition-[background-color,transform,backdrop-filter] duration-200",
          scrolled && "glass-header",
          hidden && !open && "-translate-y-full",
        )}
      >
        <div className="mx-auto grid h-[72px] max-w-[1360px] xl:h-[110px] grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10">
          <nav aria-label="Primary" className="hidden items-center gap-6 min-[900px]:flex">
            <NavLink id="work" />
            <NavLink id="services" />
          </nav>
          <a href="#top" onClick={jump("top")} className="justify-self-start min-[900px]:justify-self-center" aria-label="Zhan">
            <Logo className="xl:h-14" />
          </a>
          <div className="flex items-center justify-end gap-4 lg:gap-6">
            <nav aria-label="Secondary" className="hidden items-center gap-6 min-[900px]:flex">
              <NavLink id="reviews" />
              <NavLink id="faq" />
            </nav>
            <LangSwitch locale={locale} className="max-[360px]:hidden" />
            <a href="#contact" onClick={jump("contact")} className={cn(zBtn({ size: "sm" }), "hidden min-[900px]:inline-flex")}>
              {t(locale, "cta.discuss")}
            </a>
            <button
              className="relative grid size-11 place-items-center min-[900px]:hidden"
              aria-label={open ? t(locale, "nav.close") : t(locale, "nav.menu")}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={cn("absolute h-[1.6px] w-6 bg-text transition-transform duration-200", open ? "rotate-45" : "-translate-y-1")} />
              <span className={cn("absolute h-[1.6px] w-6 bg-text transition-transform duration-200", open ? "-rotate-45" : "translate-y-1")} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-label={t(locale, "nav.menu")}
          className="fixed inset-0 z-40 flex flex-col bg-bg/[.98] px-6 pt-[96px] pb-[max(24px,env(safe-area-inset-bottom))] min-[900px]:hidden"
        >
          <nav className="flex flex-col gap-4">
            {SECTIONS.map((id, i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={jump(id)}
                className="anim-rise font-display text-[32px] font-semibold"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {t(locale, `nav.${id}`)}
              </a>
            ))}
          </nav>
          <LangSwitch locale={locale} className="mt-8 w-40" />
          <a href="#contact" onClick={jump("contact")} className={cn(zBtn(), "mt-auto w-full")}>
            {t(locale, "cta.discuss")} <ArrowUR />
          </a>
        </div>
      )}

      <a
        href="#contact"
        onClick={jump("contact")}
        className={cn(
          zBtn(),
          "fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 z-40 -translate-x-1/2 shadow-sticker transition-[opacity,transform] duration-200 min-[768px]:hidden",
          mini && !open ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        )}
        aria-hidden={!mini}
        tabIndex={mini ? 0 : -1}
      >
        {t(locale, "cta.discuss")} <ArrowUR />
      </a>
    </>
  );
}
