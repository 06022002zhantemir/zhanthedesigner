import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { htmlLang, t, type Locale } from "@/lib/i18n";
import { faq, services, settings, testimonials, type Testimonial } from "@/lib/site";
import { ArrowUR, FiverrMark, QuoteMark, Reveal, scrollToId } from "./ui";
import { setWorkFilter } from "./Work";

/* ---------------- Services ---------------- */
export function Services({ locale }: { locale: Locale }) {
  return (
    <section id="services" aria-labelledby="services-title" className="section-pad pt-0">
      <div className="container-z">
        <h2 id="services-title" className="h2-section">{t(locale, "services.title")}</h2>
        <p className="mt-3 text-text-muted">{t(locale, "services.sub")}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <Reveal key={s.cat} delay={i * 60}>
              <button
                onClick={() => {
                  setWorkFilter(s.cat);
                  scrollToId("work");
                }}
                className="group relative flex h-full min-h-[260px] w-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface p-7 text-left transition-colors hover:bg-surface-hover"
              >
                <span className="absolute top-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-hot transition-transform duration-300 group-hover:scale-x-100" />
                <span className="font-display text-sm text-text-muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 font-display text-lg font-semibold">{s.title[locale]}</h3>
                <p className="mt-2 text-sm text-text-muted">{s.desc[locale]}</p>
                <div className="mt-auto pt-6">
                  <div className="flex flex-wrap gap-1.5">
                    {s.tags.map((tg) => (
                      <span key={tg} className="rounded-full border border-line-strong px-2 py-0.5 text-[11px] text-text-muted">{tg}</span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm transition-colors group-hover:text-hot">{t(locale, "services.examples")}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
        <ol className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(["process.1", "process.2", "process.3", "process.4"] as const).map((k, i) => (
            <li key={k} className="relative border-t border-line-strong pt-4 text-sm">
              <span className="absolute -top-[5px] left-0 size-2 rounded-full bg-hot" aria-hidden="true" />
              <span className="text-text-muted">{i + 1}. </span>
              {t(locale, k)}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */
const AV = ["bg-av-1", "bg-av-2", "bg-av-3", "bg-av-4"];
const avColor = (name: string) => {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AV[h % AV.length];
};

function ReviewCard({ r, locale }: { r: Testimonial; locale: Locale }) {
  const long = r.text.length > 320;
  const [full, setFull] = useState(false);
  return (
    <article className="rounded-[20px] border border-line bg-surface p-6 xl:px-10 xl:py-7">
      <QuoteMark />
      <div className={cn("mt-4 space-y-3 text-[15px] leading-[1.4] xl:text-[17px]", long && !full && "max-sm:line-clamp-6")}>
        {r.text.split("\n\n").map((para, i) => (
          <p key={i} className="whitespace-pre-line">{para}</p>
        ))}
      </div>
      {long && (
        <button onClick={() => setFull((f) => !f)} className="mt-2 text-sm text-hot sm:hidden">
          {t(locale, full ? "reviews.less" : "reviews.more")}
        </button>
      )}
      <div className="mt-4 flex items-center gap-3">
        {r.avatar ? (
          <img src={r.avatar} alt="" className="size-8 rounded-full object-cover" />
        ) : (
          <span className={cn("grid size-8 place-items-center rounded-full text-sm font-semibold text-text", avColor(r.author))} aria-hidden="true">
            {(r.author[0] ?? "?").toUpperCase()}
          </span>
        )}
        <div>
          <p className="text-sm">{r.author}</p>
          <p className="text-[10px] text-text-muted">{r.flag} {r.country}</p>
        </div>
      </div>
    </article>
  );
}

export function Reviews({ locale }: { locale: Locale }) {
  const [t1, t2, t3, t4] = testimonials;
  const rest = testimonials.slice(4);
  const [dot, setDot] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section-pad pt-0 xl:pt-14 xl:pb-20">
      <div className="container-z">
        <div className="flex items-end justify-between gap-4">
          <h2 id="reviews-title" className="h2-section">{t(locale, "reviews.title")}</h2>
          <a href={settings.fiverrUrl} target="_blank" rel="noopener" className="flex items-baseline gap-1.5">
            <span className="text-sm text-text-muted">via</span>
            <FiverrMark />
          </a>
        </div>

        {/* Desktop / tablet masonry */}
        <div className="mt-10 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-[1.55fr_.75fr_1fr] lg:items-start">
          <Reveal>{t1 && <ReviewCard r={t1} locale={locale} />}</Reveal>
          <div className="flex flex-col gap-4">
            <Reveal delay={60}>{t2 && <ReviewCard r={t2} locale={locale} />}</Reveal>
            <Reveal delay={120}>{t3 && <ReviewCard r={t3} locale={locale} />}</Reveal>
          </div>
          <div className="flex flex-col gap-4">
            <Reveal delay={180}>{t4 && <ReviewCard r={t4} locale={locale} />}</Reveal>
            {rest.map((r) => <ReviewCard key={r.id} r={r} locale={locale} />)}
          </div>
        </div>

        {/* Mobile carousel */}
        <div
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setDot(Math.round(el.scrollLeft / (el.clientWidth * 0.85)));
          }}
          className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:hidden"
        >
          {testimonials.map((r) => (
            <div key={r.id} className="w-[85%] shrink-0 snap-center">
              <ReviewCard r={r} locale={locale} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
          {testimonials.map((r, i) => (
            <span key={r.id} className={cn("h-1.5 rounded-full transition-all", i === dot ? "w-5 bg-hot" : "w-1.5 bg-line-strong")} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState<number | null>(0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: htmlLang[locale],
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q[locale],
      acceptedAnswer: { "@type": "Answer", text: f.a[locale] },
    })),
  };
  return (
    <section id="faq" aria-labelledby="faq-title" className="section-pad pt-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-z grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 id="faq-title" className="h2-section">{t(locale, "faq.title")}</h2>
          <p className="mt-4 text-text-muted">
            {t(locale, "faq.side")}{" "}
            <a href={`https://t.me/${settings.contacts.telegram}`} target="_blank" rel="noopener" className="text-text underline decoration-hot underline-offset-4">
              {t(locale, "faq.sideLink")}
            </a>
          </p>
        </div>
        <div className="border-t border-line">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-line">
                <h3>
                  <button
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg"
                  >
                    {f.q[locale]}
                    <Plus className={cn("size-5 shrink-0 transition-transform duration-[250ms]", isOpen && "rotate-45 text-hot")} strokeWidth={1.6} />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={cn("grid transition-[grid-template-rows] duration-[250ms]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 text-text-muted">{f.a[locale]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
export function Contact({ locale }: { locale: Locale; projectRef?: string }) {
  const { telegram, email, instagram } = settings.contacts;
  const tg = `https://t.me/${telegram}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast(t(locale, "contact.copied"), { duration: 2000 });
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  const rowCls =
    "group flex h-14 w-full items-center justify-between gap-4 border-t border-ink-line px-1 text-[15px] transition-colors hover:bg-ink/[.03]";
  const Val = ({ children }: { children: React.ReactNode }) => (
    <span className="flex items-center gap-2 text-ink transition-transform duration-200 group-hover:-translate-x-1">
      {children}
      <span className="opacity-0 transition-opacity group-hover:opacity-100"><ArrowUR /></span>
    </span>
  );

  return (
    <section id="contact" aria-labelledby="contact-title" className="pb-16">
      <div className="container-z">
        <Reveal>
          <div className="on-cream grid gap-10 rounded-[32px] bg-cream p-8 text-ink md:grid-cols-2 md:p-12 lg:p-[72px]">
            <div>
              <h2 id="contact-title" className="h2-contact">
                {(["contact.t1", "contact.t2", "contact.t3", "contact.t4"] as const).map((k) => (
                  <span key={k} className="block">{t(locale, k)}</span>
                ))}
              </h2>
              <p className="mt-6 max-w-[420px] text-ink-muted">
                {t(locale, "contact.sub1")}{" "}
                <a href={tg} target="_blank" rel="noopener" className="text-ink underline decoration-hot underline-offset-4">Telegram</a>
                {locale === "kz" ? "" : " "}
                {t(locale, "contact.sub2")}
              </p>
              <div className="mt-10 border-b border-ink-line">
                <a href={tg} target="_blank" rel="noopener" className={rowCls}>
                  <span className="text-ink-muted">Telegram</span>
                  <Val>@{telegram}</Val>
                </a>
                <button onClick={copy} aria-label={t(locale, "contact.copy")} className={rowCls}>
                  <span className="text-ink-muted">Email</span>
                  <Val><span className="truncate">{email}</span></Val>
                </button>
                <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener" className={rowCls}>
                  <span className="text-ink-muted">Instagram</span>
                  <Val>{instagram}</Val>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="container-z pt-12 pb-24 text-[13px] text-text-dim md:pb-10">
      <p>© {new Date().getFullYear()} Zhan · {t(locale, "footer")}</p>
    </footer>
  );
}
