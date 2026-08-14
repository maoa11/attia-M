"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers/LanguageProvider";
import { carouselClips } from "@/data/projects";
import { work } from "@/data/content";
import { cardSrc, posterSrc } from "@/lib/asset";

/**
 * Overlapping coverflow carousel — the same motion as the reels carousel on the
 * Bedeiry site, which is the reference the client asked for.
 *
 * The numbers are the ones that were tuned there and are what give it its feel:
 * cards overlap at 0.55 of their width, each step out from centre scales by
 * 0.9 and rotates 13°, and nothing auto-rotates — the visitor drives it with
 * the arrows, the keyboard, or a swipe.
 *
 * Only the cards nearest the centre carry a <video>; the rest are poster images
 * until they come close. Playing every card in the arc — thirteen of them on a
 * wide screen — held thirteen live decoders open at once and made the whole
 * page hitch and freeze periodically. Seven is smooth, and because a poster sits
 * under every card the swap is invisible.
 */
const PLAY_RADIUS = 3;

export default function Work() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [cardW, setCardW] = useState(280);
  const swiped = useRef(false);
  const settle = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { t } = useLang();

  const n = carouselClips.length;

  // Shortest signed distance around the ring, so the strip wraps in both
  // directions instead of running out at either end.
  const signedDist = useCallback(
    (i: number, from: number) => {
      const d = (i - from) % n;
      return d > n / 2 ? d - n : d < -n / 2 ? d + n : d;
    },
    [n],
  );

  const render = useCallback(
    (from: number, width: number) => {
      const spacing = width * 0.55;
      const maxSide = Math.ceil(window.innerWidth / 2 / spacing) + 1;

      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = signedDist(i, from);
        const abs = Math.abs(d);
        const scale = Math.pow(0.9, abs);
        const ry = d === 0 ? 0 : d > 0 ? -13 : 13;

        card.style.zIndex = String(60 - abs);
        card.style.opacity = abs > maxSide ? "0" : "1";
        card.style.pointerEvents = abs > maxSide ? "none" : "auto";
        card.style.transform = `translateY(-50%) translateX(${d * spacing}px) scale(${scale}) rotateY(${ry}deg)`;
      });
    },
    [signedDist],
  );

  // Playback is synced separately from layout and deferred, so rapid arrow
  // presses move the cards instantly and only settle into play() once.
  const syncPlayback = useCallback(
    (from: number) => {
      cards.current.forEach((card, i) => {
        // Only the cards inside PLAY_RADIUS have a <video> at all; the rest
        // resolve to null here and stay as posters.
        const video = card?.querySelector("video");
        if (!video) return;
        if (Math.abs(signedDist(i, from)) <= PLAY_RADIUS) {
          if (video.paused) void video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    },
    [signedDist],
  );

  const layout = useCallback(() => {
    const el = stage.current;
    if (!el) return;
    const stageH = el.getBoundingClientRect().height;
    const vw = window.innerWidth;
    // 0.78 rather than filling the stage height: it puts the centre card at
    // roughly the size it is on the Bedeiry strip, which in turn keeps the
    // spacing tight enough for a long overlapping arc rather than a few big
    // cards floating in the middle.
    const byHeight = (stageH * 0.78 * 9) / 16;
    // Smaller cards on phones so the whole overlapping arc is visible rather
    // than one card filling the screen.
    const widthFactor = vw <= 640 ? 0.42 : 0.62;
    const minW = vw <= 640 ? 120 : 160;
    const width = Math.max(minW, Math.min(byHeight, vw * widthFactor, 330));
    setCardW(width);
    el.style.setProperty("--card-w", `${width}px`);
    return width;
  }, []);

  useEffect(() => {
    const relayout = () => {
      const w = layout() ?? cardW;
      render(current, w);
      syncPlayback(current);
    };

    relayout();

    // A ResizeObserver rather than window.resize alone: on first paint the stage
    // has not resolved its clamped height yet, so card width fell back to the
    // 120px minimum and stayed there until something forced a resize. The
    // observer fires as soon as the real height lands.
    const observer = new ResizeObserver(relayout);
    if (stage.current) observer.observe(stage.current);

    // Width-only changes leave the stage height alone, so the window listener
    // still earns its place.
    const onVisible = () => {
      if (!document.hidden) syncPlayback(current);
    };
    window.addEventListener("resize", relayout);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", relayout);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const go = useCallback(
    (dir: number) => {
      setCurrent((c) => {
        const next = (c + dir + n) % n;
        render(next, cardW);
        if (settle.current) clearTimeout(settle.current);
        settle.current = setTimeout(() => syncPlayback(next), 260);
        return next;
      });
    },
    [cardW, n, render, syncPlayback],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 40) {
      swiped.current = true;
      go(dx < 0 ? 1 : -1);
      setTimeout(() => {
        swiped.current = false;
      }, 100);
    }
    startX.current = null;
  };

  const active = carouselClips[current];

  return (
    // Full viewport on desktop; on a phone the section sizes to its content with
    // Bedeiry's padding, so it does not stretch to fill a tall screen.
    <section
      id="work"
      className="relative flex flex-col justify-center py-[clamp(48px,8vh,64px)] sm:min-h-[100svh] sm:py-10"
    >
      <div className="pad-x">
        <span className="t-meta t-gold !text-[var(--color-gold)]">{t(work.label)}</span>
      </div>

      {/* Full-bleed on purpose — the arc is meant to run past both edges of the
          screen, and body's overflow-x: clip does the trimming. */}
      <div
        ref={stage}
        // Stage height on mobile matches `.works .stage` on the Bedeiry site.
        className="relative mt-6 h-[clamp(280px,40vh,340px)] [perspective:1400px] sm:h-[clamp(400px,64vh,660px)]"
        // pan-y keeps vertical page scrolling native and leaves the horizontal
        // axis to the swipe handler, so dragging the arc never fights the page.
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute start-[clamp(10px,2vw,28px)] top-1/2 z-[80] grid h-[clamp(44px,5vw,58px)] w-[clamp(44px,5vw,58px)] -translate-y-1/2 place-items-center rounded-full border border-[var(--line)] bg-[rgba(15,15,15,.72)] text-lg text-white/80 transition-colors hover:border-white hover:bg-white hover:text-black"
        >
          <span className="rtl:hidden">‹</span>
          <span className="hidden rtl:inline">›</span>
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute end-[clamp(10px,2vw,28px)] top-1/2 z-[80] grid h-[clamp(44px,5vw,58px)] w-[clamp(44px,5vw,58px)] -translate-y-1/2 place-items-center rounded-full border border-[var(--line)] bg-[rgba(15,15,15,.72)] text-lg text-white/80 transition-colors hover:border-white hover:bg-white hover:text-black"
        >
          <span className="rtl:hidden">›</span>
          <span className="hidden rtl:inline">‹</span>
        </button>

        {carouselClips.map((card, i) => (
          <div
            key={card.name}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 aspect-[9/16] cursor-pointer transition-[transform,opacity] duration-[550ms] ease-[cubic-bezier(.22,1,.36,1)]"
            style={{ width: "var(--card-w, 280px)", marginLeft: "calc(var(--card-w, 280px) / -2)" }}
            onClick={() => {
              if (swiped.current) return;
              // Off-centre cards bring themselves to the front first; only the
              // centre card opens, so a click never navigates unexpectedly.
              const d = signedDist(i, current);
              if (d !== 0) go(d > 0 ? 1 : -1);
              else router.push(`/work/${card.slug}`);
            }}
            data-cursor={signedDist(i, current) === 0 ? t(work.view) : ""}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#111] shadow-[0_18px_60px_rgba(0,0,0,.55)] transition-transform duration-300 hover:scale-[1.04]">
              {/* The poster is always the base layer, so a card is never blank
                  and never flashes while its video mounts or unmounts. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterSrc(card.name)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 block h-full w-full object-cover"
                aria-hidden="true"
              />
              {Math.abs(signedDist(i, current)) <= PLAY_RADIUS && (
                <video
                  className="relative block h-full w-full object-cover"
                  poster={posterSrc(card.name)}
                  preload="auto"
                  muted
                  loop
                  playsInline
                  disablePictureInPicture
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <source src={cardSrc(card.name)} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Title of the centre card, swapped as the strip moves. Keyed on the
          slug so it remounts and re-runs its fade on every step. */}
      <div key={active.name} className="pad-x mt-6 animate-[fade_.5s_ease] text-center">
        <h2 className="t-display text-[0.78rem] text-white">{t(active.title)}</h2>
        <p className="t-meta t-gold !text-[var(--color-gold)] mt-2">
          {t(active.category)} — {active.year}
        </p>
      </div>
    </section>
  );
}
