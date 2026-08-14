/**
 * Next rewrites `basePath` into <Link> and next/image, but not into raw
 * <video src> or <img src> attributes — and this site is almost entirely raw
 * video tags. Everything under public/ therefore goes through `asset()`.
 *
 * Must match `basePath` in next.config.ts. "/attia-M" for the GitHub Pages
 * project site; empty for a custom domain at a root.
 */
const BASE_PATH = "/attia-M";

export const asset = (path: string) => `${BASE_PATH}${path}`;

/** 400px silent proxy — safe to autoplay many at once, for carousel cards. */
export const cardSrc = (name: string) => asset(`/media/card/${name}.mp4`);

/**
 * 1080p silent copy for anything shown full-bleed. Blowing a card proxy up to
 * fill a hero is what makes an opening look soft, so large video pulls here.
 */
export const bigSrc = (name: string) => asset(`/media/big/${name}.mp4`);

/** Full-quality file with audio — only ever mounted inside the lightbox. */
export const fullSrc = (name: string) => asset(`/media/full/${name}.mp4`);

/** Poster frame. Never let a video show a black first frame. */
export const posterSrc = (name: string) => asset(`/media/poster/${name}.jpg`);
