"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLang } from "@/components/providers/LanguageProvider";
import BigVideo from "@/components/ui/BigVideo";
import VideoTile from "@/components/ui/VideoTile";
import Lightbox from "@/components/ui/Lightbox";
import Reveal, { RevealLines } from "@/components/ui/Reveal";
import Footer from "@/components/ui/Footer";
import { getNextProject, type Project } from "@/data/projects";
import { ui } from "@/data/content";

/**
 * The detail view reached from the carousel.
 *
 * Deliberately scannable rather than long: a title over the footage, a facts
 * strip you can read in one pass, one short paragraph, then the clips — and a
 * full-bleed handover so the next project is one click away.
 *
 * Clips are height-capped rather than width-capped. A 9:16 video sized to the
 * width of a laptop is taller than the screen; capping height is what keeps a
 * vertical piece watchable without scrolling to follow it.
 */
export default function CaseStudy({ project }: { project: Project }) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<{ name: string; vertical: boolean } | null>(null);
  const next = getNextProject(project.slug);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const facts = [
    { label: t(ui.client), value: t(project.client) },
    { label: t(ui.year), value: project.year },
    { label: t(ui.role), value: project.role[lang].join(" · ") },
    { label: t(ui.kit), value: project.kit.join(" · ") },
  ];

  return (
    <>
      <article>
        {/* ------------------------------------------------------------ hero */}
        <section
          ref={heroRef}
          className="relative flex h-[78svh] min-h-[420px] items-end overflow-hidden"
        >
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <BigVideo name={project.clips[0].name} className="opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-[#000000]/55" />
          </motion.div>

          <div className="relative z-10 w-full pad-x pb-12">
            <Link href="/#work" className="link-underline t-meta mb-8 inline-block" data-cursor={t(ui.back)}>
              ← {t(ui.back)}
            </Link>
            <p className="t-meta t-gold !text-[var(--color-gold)] mb-4">
              {project.number} — {t(project.category)}
            </p>
            <h1 className="t-hero !text-[clamp(1.9rem,7.5vw,6rem)]">
              <RevealLines lines={[t(project.title)]} />
            </h1>
          </div>
        </section>

        {/* ------------------------------------------- facts + one paragraph */}
        <section className="pad-x py-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-[clamp(2rem,4vw,4rem)]">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 lg:col-span-5 lg:grid-cols-1 lg:gap-y-6">
              {facts.map((fact, i) => (
                <Reveal key={fact.label} delay={i * 0.04}>
                  <dt className="t-meta">{fact.label}</dt>
                  <dd className="mt-2 text-[0.92rem] font-light leading-snug text-white/85">
                    {fact.value}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <div className="lg:col-span-7">
              <Reveal>
                <p className="t-editorial text-[clamp(1.15rem,2.4vw,1.9rem)] leading-[1.35] text-white/90">
                  {t(project.overview)}
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-10 grid gap-8 pt-2 sm:grid-cols-2">
                  <div>
                    <h2 className="t-meta">{t(ui.challenge)}</h2>
                    <p className="t-body mt-3 !text-[0.9rem]">{t(project.challenge)}</p>
                  </div>
                  <div>
                    <h2 className="t-meta">{t(ui.approach)}</h2>
                    <p className="t-body mt-3 !text-[0.9rem]">{t(project.approach)}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- clips */}
        <section className="pad-x pb-16">
          <div className="flex items-baseline justify-between gap-6">
            <span className="t-meta t-gold !text-[var(--color-gold)]">{t(ui.gallery)}</span>
            <span className="t-meta tabular-nums">
              {String(project.clips.length).padStart(2, "0")}
            </span>
          </div>

          <ul className="mt-10 flex flex-wrap items-start justify-center gap-6 md:gap-8">
            {project.clips.map((clip, i) => (
              <Reveal
                as="li"
                key={clip.name}
                delay={i * 0.05}
                className={clip.vertical ? "w-[min(260px,44vw)] md:w-[min(300px,26vw)]" : "w-full"}
              >
                <button
                  type="button"
                  onClick={() => setOpen({ name: clip.name, vertical: clip.vertical })}
                  className="group block w-full text-start"
                  data-cursor={lang === "ar" ? "تشغيل" : "Play"}
                >
                  <div
                    className="clip relative w-full bg-[var(--color-ink-2)]"
                    style={{ aspectRatio: clip.vertical ? "9 / 16" : "16 / 9" }}
                  >
                    <div className="h-full w-full transition-transform duration-[1.1s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]">
                      <VideoTile name={clip.name} />
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </ul>

        </section>

        {/* ------------------------------------------- next project handover */}
        <Link
          href={`/work/${next.slug}`}
          className="group relative flex h-[56svh] min-h-[320px] items-center justify-center overflow-hidden"
          data-cursor={t(ui.next)}
        >
          <div className="absolute inset-0 transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]">
            <VideoTile name={next.clips[0].name} rounded={false} className="opacity-30" />
            <div className="absolute inset-0 bg-[#000000]/45 transition-colors duration-1000 group-hover:bg-[#000000]/25" />
          </div>
          <div className="relative z-10 flex flex-col items-center gap-4 pad-x text-center">
            <span className="t-meta t-gold !text-[var(--color-gold)]">{t(ui.next)}</span>
            <span className="t-section">{t(next.title)}</span>
          </div>
        </Link>

        <Footer />
      </article>

      <Lightbox
        name={open?.name ?? null}
        vertical={open?.vertical ?? true}
        caption={`${t(project.title)} — ${t(project.category)}`}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
