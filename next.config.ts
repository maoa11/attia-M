import type { NextConfig } from "next";

/**
 * Static export — the whole site is prerendered HTML plus the video files in
 * public/media, so it drops onto GitHub Pages (or any static host) with no
 * server runtime.
 *
 * `basePath` is set because this deploys as a GitHub Pages *project* site, at
 * https://maoa11.github.io/attia-M/ rather than at a domain root.
 *
 * Raw <video src> and <img src> attributes are not rewritten by Next — those go
 * through `asset()` in src/lib/asset.ts, whose `BASE_PATH` must be kept equal to
 * the value below. Moving to a custom domain means emptying both.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/attia-M",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
