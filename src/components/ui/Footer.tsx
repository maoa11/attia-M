"use client";

import { useLang } from "@/components/providers/LanguageProvider";
import { footer, site } from "@/data/content";

/**
 * A single quiet line. The separating rule and the back-to-top link were both
 * removed on the client's instruction — the page ends, and that is enough.
 */
export default function Footer() {
  const { t, lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="pad-x pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-10">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="t-meta">
          © {year} {lang === "ar" ? site.nameAr : site.name} — {t(footer.rights)}
        </p>
        <p className="t-meta">{t(footer.built)}</p>
      </div>
    </footer>
  );
}
