"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The site's one reveal. Everything that enters the viewport does it the same
 * way — a short rise out of a blur — because a page where each section has its
 * own entrance reads as a demo reel of animations rather than a design.
 *
 * `once` is on everywhere: re-animating on scroll-back is the single most
 * common way premium sites start to feel cheap.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 1.05, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Component>
  );
}

/**
 * Line-by-line headline reveal: each line rides up from behind a clipped edge.
 * Takes pre-split lines rather than splitting text itself, so the caller stays
 * in control of where a headline breaks at each viewport width.
 */
export function RevealLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line + i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "108%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: 1.15,
              delay: delay + i * 0.09,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
