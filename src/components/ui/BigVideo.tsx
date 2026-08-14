"use client";

import { useEffect, useRef } from "react";
import { bigSrc, posterSrc } from "@/lib/asset";

/**
 * Full-bleed background video. Same play-while-visible behaviour as VideoTile,
 * but sourced from the 1080p `big/` tier because this one is stretched across
 * the whole viewport — the 400px card proxy goes visibly soft at that size.
 */
export default function BigVideo({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (reduced || connection?.saveData) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      poster={posterSrc(name)}
      preload="auto"
      muted
      loop
      playsInline
      autoPlay
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src={bigSrc(name)} type="video/mp4" />
    </video>
  );
}
