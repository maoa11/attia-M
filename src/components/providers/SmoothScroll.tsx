"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis eases the scroll; nothing else.
 *
 * This used to drive Lenis from GSAP's ticker and keep ScrollTrigger in sync,
 * back when the work section was a pinned horizontal strip. That section is now
 * a carousel and the hero's parallax runs on Framer Motion's `useScroll`, so
 * GSAP had no remaining job — it was ~150KB of JavaScript on every page load
 * for nothing. Lenis runs its own rAF loop instead.
 *
 * Reduced-motion users are left on native scrolling entirely.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // In-page anchors hand off to Lenis so they ease rather than jump.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = anchor?.getAttribute("href");
      if (!anchor || !href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    // The loader and the lightbox both need to freeze scrolling.
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}
