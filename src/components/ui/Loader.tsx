"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import { site } from "@/data/content";

/**
 * The loader is an aperture opening: the ring draws itself while a counter
 * runs, then two horizontal blades split apart to reveal the hero — the same
 * gesture as a shutter, which is the only loading metaphor a videographer's
 * site should use.
 *
 * Scroll is locked until it finishes so the visitor never lands mid-page. It
 * shows once per tab (sessionStorage), because sitting through a 2s loader on
 * every navigation is charming exactly once.
 */
const DURATION = 1900;

export default function Loader() {
  const { lang } = useLang();
  const [done, setDone] = useState(true);
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.sessionStorage.getItem("attia-loaded")) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      window.sessionStorage.setItem("attia-loaded", "1");
      return;
    }

    setDone(false);
    document.body.style.overflow = "hidden";
    const lenis = (window as Window & { __lenis?: { stop: () => void; start: () => void } })
      .__lenis;
    lenis?.stop();

    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // Ease-out so the counter sprints early and settles on 100.
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        window.sessionStorage.setItem("attia-loaded", "1");
        setDone(true);
        document.body.style.overflow = "";
        lenis?.start();
      }
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf.current);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.75 }}
        >
          {/* Two blades that part in the middle — the shutter opening. */}
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2 bg-[#000000]"
            exit={{ y: "-100%" }}
            transition={{ duration: 1.05, ease: [0.83, 0, 0.17, 1] }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[#000000]"
            exit={{ y: "100%" }}
            transition={{ duration: 1.05, ease: [0.83, 0, 0.17, 1] }}
          />

          <motion.div
            className="relative flex flex-col items-center gap-8"
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative grid place-items-center">
              <svg width="132" height="132" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="48" stroke="rgba(255,255,255,.12)" strokeWidth="0.6" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="48"
                  stroke="#fff"
                  strokeWidth="0.6"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ rotate: -90, transformOrigin: "50% 50%" }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: DURATION / 1000, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>
              <span className="t-meta absolute tabular-nums !text-white/80">
                {String(count).padStart(3, "0")}
              </span>
            </div>

            <div className="overflow-hidden">
              <motion.p
                className="t-display text-[0.7rem] text-white/70"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              >
                {lang === "ar" ? site.nameAr : site.name}
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
