"use client";

import { useEffect, useRef } from "react";
import { cardSrc, posterSrc } from "@/lib/asset";

/**
 * A silent 480p proxy that plays only while it is on screen.
 *
 * Two rules are load-bearing here, both learned the expensive way on a previous
 * filmmaker site:
 *
 *  1. Every open <video> is a live decode pipeline. A grid of full-resolution
 *     clips playing at once will drag the whole page down, so tiles always use
 *     the card/ proxy and the full file is only ever mounted in the lightbox.
 *  2. A poster is mandatory. Without it the tile shows a black rectangle until
 *     the first frame decodes, which on a videographer's site reads as broken.
 */
export default function VideoTile({
  name,
  className = "",
  rounded = true,
  eager = false,
}: {
  name: string;
  className?: string;
  rounded?: boolean;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Data-saver and reduced-motion users get the poster and nothing else.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (reduced || connection?.saveData) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.preload = "auto";
          // play() rejects if the element is torn down mid-promise; ignoring it
          // is correct, there is nothing to recover.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${rounded ? "rounded-[2px]" : ""} ${className}`}
      poster={posterSrc(name)}
      preload={eager ? "auto" : "metadata"}
      muted
      loop
      playsInline
      // Safari on iOS refuses inline autoplay without this attribute pair.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore -- non-standard but required by older iOS builds
      webkit-playsinline="true"
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src={cardSrc(name)} type="video/mp4" />
    </video>
  );
}
