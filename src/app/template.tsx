"use client";

import { motion } from "framer-motion";

/**
 * Route-level transition. `template.tsx` remounts on every navigation (unlike
 * layout.tsx), which is exactly what a page transition needs.
 *
 * A blade wipes down over the outgoing page and lifts off the incoming one —
 * the same shutter gesture as the loader, so arriving at a case study feels
 * like a cut rather than a page load.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        className="pointer-events-none fixed inset-0 z-[85] origin-top bg-[#000000]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        {children}
      </motion.div>
    </>
  );
}
