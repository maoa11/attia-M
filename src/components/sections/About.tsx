"use client";

import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/content";
import { asset } from "@/lib/asset";

/**
 * The client's finished artwork, shown exactly as supplied — same treatment as
 * the closing page on the Bedeiry site.
 *
 * Nothing is overlaid, re-typeset or translated: the headline, the disciplines
 * and the three numbers are all part of the image. It stays English in both
 * languages because it is artwork, not copy.
 *
 * The reason it no longer shows a cut edge is that the page background is now
 * pure black. The artwork's own background is #000 on every edge, so against
 * the old #0a0a0b page it read as a slightly darker rectangle. Matching the two
 * makes the boundary disappear — which is why --color-ink must stay #000000.
 */
// No min-height, exactly as `.finalpage` on the Bedeiry site: the section is the
// artwork plus padding and nothing more. Forcing it to a full viewport left a
// large empty gap above and below on a phone, where the 16:9 image is only
// ~208px tall.
export default function About() {
  return (
    <section
      id="about"
      className="relative flex items-center justify-center py-[clamp(24px,5vh,64px)]"
    >
      <Reveal className="w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/brand/about.webp")}
          alt={`${site.name} — visual storyteller. Commercials, documentaries and films. 30+ brands, 250+ videos delivered.`}
          width={1686}
          height={933}
          loading="lazy"
          decoding="async"
          // pointer-events off matches the reference and stops the long-press
          // "save image" sheet on mobile.
          className="pointer-events-none mx-auto block w-[min(100%,1686px)] select-none"
        />
      </Reveal>
    </section>
  );
}
