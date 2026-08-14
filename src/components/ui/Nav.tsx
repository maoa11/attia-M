"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import Aperture from "@/components/ui/Aperture";
import { site } from "@/data/content";

/**
 * His name and the language switch. Nothing else.
 *
 * The section links and the mobile menu were removed on the client's
 * instruction — on a four-screen site the scroll *is* the navigation, and a bar
 * of links over full-bleed video is a strip of the work you cannot see.
 *
 * It still hides on scroll-down and returns on scroll-up, and sits in
 * mix-blend-difference so it stays legible over both bright and dark frames
 * without needing a background plate.
 */
export default function Nav() {
  const { lang, toggle } = useLang();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      // The 120px floor stops the bar flickering on rubber-band scroll at the top.
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[80] pad-x"
      animate={{ y: hidden ? "-110%" : 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between gap-6 py-5 mix-blend-difference">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={site.name}
          data-cursor={lang === "ar" ? "الرئيسية" : "Home"}
        >
          <Aperture
            size={17}
            className="text-white transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-90"
          />
          <span className="t-display text-[0.66rem] text-white">
            {lang === "ar" ? site.nameAr : site.name}
          </span>
        </Link>

        <button
          type="button"
          onClick={toggle}
          className="t-meta !text-white/75 transition-colors hover:!text-white"
          aria-label={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
        >
          {lang === "en" ? "ع" : "EN"}
        </button>
      </div>
    </motion.header>
  );
}
