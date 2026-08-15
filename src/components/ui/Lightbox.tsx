"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import { fullSrc, posterSrc } from "@/lib/asset";
import { ui } from "@/data/content";

type Lenis = { stop: () => void; start: () => void };

/**
 * The only place the full-quality file with audio is ever mounted. It is
 * created on open and destroyed on close, so a visitor who never clicks a tile
 * never downloads a single large video.
 */
export default function Lightbox({
  name,
  vertical,
  caption,
  onClose,
}: {
  name: string | null;
  vertical: boolean;
  caption?: string;
  onClose: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const { t } = useLang();

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!name) return;

    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [name, close]);

  return (
    <AnimatePresence>
      {name && (
        <motion.div
          className="fixed inset-0 z-[95] grid place-items-center bg-[#000000]/96 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={caption ?? "Video"}
        >
          <motion.div
            className="relative flex flex-col items-center gap-5 px-[var(--gutter)]"
            initial={{ scale: 0.94, opacity: 0, filter: "blur(12px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={video}
              className="max-h-[78svh] w-auto max-w-full rounded-[3px] bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,.9)]"
              style={{ aspectRatio: vertical ? "9 / 16" : "16 / 9" }}
              src={fullSrc(name)}
              poster={posterSrc(name)}
              controls
              autoPlay
              loop
              playsInline
            />
            {caption && <p className="t-meta text-center">{caption}</p>}
          </motion.div>

          <button
            type="button"
            onClick={close}
            className="t-meta absolute end-[var(--gutter)] top-[max(1.5rem,env(safe-area-inset-top))] !text-white/70 transition-colors hover:!text-white"
            data-cursor={t(ui.close)}
          >
            {t(ui.close)} ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
