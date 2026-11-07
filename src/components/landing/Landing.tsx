import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { localePath, type Locale } from "@/lib/i18n";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Work } from "./Work";
import { Contact, Footer, Reviews } from "./Sections";

function detectLocale(): Locale {
  const n = (navigator.language || "ru").toLowerCase();
  if (n.startsWith("kk")) return "kz";
  if (/^(ru|uk|be|uz|ky|tg|hy|az)/.test(n)) return "ru";
  if (/^[a-z]/.test(n) && !n.startsWith("ru")) return "en";
  return "ru";
}

export function Landing({ locale }: { locale: Locale }) {
  const [projectRef, setProjectRef] = useState("");
  const navigate = useNavigate();

  // First visit to "/" with no saved choice: route by browser language.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("zhan_lang") as Locale | null;
      if (saved) {
        if (locale === "ru" && saved !== "ru" && window.location.pathname === "/") navigate({ to: localePath[saved], replace: true });
        return;
      }
      if (window.location.pathname !== "/") {
        localStorage.setItem("zhan_lang", locale);
        return;
      }
      const d = detectLocale();
      localStorage.setItem("zhan_lang", d);
      if (d !== "ru") navigate({ to: localePath[d], replace: true });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div key={locale} className="anim-fade min-h-screen bg-bg" style={{ animationDuration: "150ms" }}>
      <Header locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <Work locale={locale} onReference={setProjectRef} />
        <Reviews locale={locale} />

        <Contact locale={locale} projectRef={projectRef} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
