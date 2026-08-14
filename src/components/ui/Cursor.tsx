"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A single aperture ring following the pointer, with a label that appears over
 * anything carrying `data-cursor="…"`. Position is written straight to the
 * transform in a rAF loop rather than through React state — re-rendering on
 * mousemove is the classic way these end up feeling heavy.
 *
 * Never mounted on touch or for reduced-motion users, and the native cursor is
 * only hidden once this one is actually live, so a failure here can't leave a
 * visitor with no pointer at all.
 */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.documentElement.classList.add("cursor-none");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;

      const hit = (e.target as HTMLElement)?.closest<HTMLElement>("[data-cursor]");
      setLabel(hit?.dataset.cursor ?? "");
      setActive(Boolean(hit));
    };

    const loop = () => {
      // Light lerp: enough lag to feel like glass, not enough to feel broken.
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={ring}
      className="pointer-events-none fixed left-0 top-0 z-[90] grid place-items-center mix-blend-difference"
      aria-hidden="true"
    >
      <div
        className="grid place-items-center rounded-full border border-white transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{
          width: active ? 78 : 26,
          height: active ? 78 : 26,
          opacity: active ? 1 : 0.7,
        }}
      >
        <span
          className="t-meta whitespace-nowrap !text-white transition-opacity duration-300"
          style={{ opacity: active ? 1 : 0, fontSize: "0.55rem", letterSpacing: "0.18em" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
