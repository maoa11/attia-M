"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLang } from "@/components/providers/LanguageProvider";
import Aperture from "@/components/ui/Aperture";
import BigVideo from "@/components/ui/BigVideo";
import { hero } from "@/data/content";

/**
 * Full-bleed opening on the Istanbul villa film — the only 16:9 piece in the
 * body of work, and therefore the only one that can fill a widescreen frame
 * without pillarboxing. Everything else on the site is 9:16 and gets composed
 * for that instead.
 *
 * The name is set the way Attia sets it himself: all caps, tracked out, with
 * the lens ring behind it.
 *
 * The parallax runs on Framer Motion, which the site already loads, rather than
 * GSAP + ScrollTrigger — that pairing was left over from the pinned-strip
 * version of the work section and cost ~150KB of JavaScript for two tweens.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });

  // The footage drifts up at half speed while the type leaves faster — enough
  // separation to read as depth, not enough to notice as an effect.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-26%"]);
  const typeOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={root}
      className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden"
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: mediaY, scale: mediaScale }}>
        <BigVideo name="istanbul-villa-1" className="opacity-[0.42]" />
        {/* Two scrims: one to seat the type, one to melt the base of the
            section into the section below it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/35 to-[#000000]/70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#000000] to-transparent" />
      </motion.div>

      {/* The ring sits off-centre and enormous, echoing the mark behind his
          name on Behance. */}
      <motion.div
        className="pointer-events-none absolute start-[6%] top-[14%] text-white/[0.07]"
        initial={{ opacity: 0, scale: 0.85, rotate: -25 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      >
        <Aperture size={420} blades strokeWidth={0.35} className="max-w-[62vw]" />
      </motion.div>

      <motion.div className="relative z-10 w-full pad-x pb-[max(2.5rem,env(safe-area-inset-bottom))]" style={{ y: typeY, opacity: typeOpacity }}>
        <motion.p
          className="t-meta t-gold !text-[var(--color-gold)] mb-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroEyebrow />
        </motion.p>

        <h1 className="t-hero">
          <HeroName />
        </h1>

        <motion.div
          className="mt-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
        >
          <HeroLine />
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroEyebrow() {
  const { t } = useLang();
  return <>{t(hero.eyebrow)}</>;
}

/**
 * The lockup rises word by word from behind a clipped edge. Arabic gets his
 * name in Arabic rather than a transliteration — most of the people this site
 * is pitching to read Arabic first.
 */
function HeroName() {
  const { lang } = useLang();
  const words = lang === "ar" ? ["عطية", "محمد"] : ["ATTIA", "MOHAMED"];

  return (
    <>
      {words.map((word, i) => (
        <span key={word} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "106%" }}
            animate={{ y: 0 }}
            transition={{ duration: 1.4, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

function HeroLine() {
  const { t } = useLang();
  // One family now serves both scripts, so the same class applies either way.
  return (
    <p className="t-editorial max-w-[34ch] text-[clamp(1.05rem,2vw,1.6rem)] text-white/80">
      {t(hero.line)}
    </p>
  );
}
