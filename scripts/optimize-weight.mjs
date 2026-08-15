// Cuts the homepage's first-load weight.
//
// It measured 10.6MB, which is why the site felt heavy. Two things dominated:
//
//  - the hero clip at 4.6MB, encoded at 1080p even though it plays full-bleed
//    at 42% opacity behind a dark scrim and a headline. 720p at a tighter
//    bitrate is indistinguishable there.
//  - the poster frames at ~100KB each, exported at 1080x1920 and then drawn
//    into carousel cards about 400px wide. Twenty times more pixels than the
//    card can show.
//
// Posters become WebP at card size. The hero gets its own lighter encode; the
// rest of the big/ tier is left alone because case-study heroes are the only
// other place it is used and they load one at a time.

import { execFile } from "node:child_process";
import { readdir, stat, rename, unlink, readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const MEDIA = path.join(ROOT, "public", "media");

const mb = (b) => (b / 1048576).toFixed(2);
const kb = (b) => (b / 1024).toFixed(0);

// ---------------------------------------------------------------- posters
// Card width tops out at 330px on desktop; 480 leaves headroom for 2x screens.
const POSTER_W = 480;
const posterDir = path.join(MEDIA, "poster");
let pBefore = 0;
let pAfter = 0;

for (const file of (await readdir(posterDir)).filter((f) => f.endsWith(".jpg"))) {
  const src = path.join(posterDir, file);
  const dest = src.replace(/\.jpg$/, ".webp");
  pBefore += (await stat(src)).size;

  const probe = await run("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height", "-of", "csv=p=0", src,
  ]);
  const [w, h] = probe.stdout.trim().split(",").map(Number);
  const scale = h > w ? `scale=${POSTER_W}:-2` : `scale=-2:${POSTER_W}`;

  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", src, "-vf", scale, "-quality", "82", dest,
  ]);
  pAfter += (await stat(dest)).size;
  await unlink(src);
}
console.log(`posters  ${mb(pBefore)}MB -> ${mb(pAfter)}MB  (jpg -> webp @${POSTER_W}px)`);

// ------------------------------------------------------------- hero clip
const hero = path.join(MEDIA, "big", "istanbul-villa-1.mp4");
const heroTmp = path.join(MEDIA, "big", "~hero.mp4");
const hBefore = (await stat(hero)).size;

await run("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-t", "14",
  "-i", hero,
  "-vf", "scale=1280:-2",
  "-c:v", "libx264", "-preset", "slow", "-crf", "30",
  "-maxrate", "900k", "-bufsize", "1800k",
  "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", "-an",
  heroTmp,
]);
await unlink(hero);
await rename(heroTmp, hero);
console.log(`hero     ${kb(hBefore)}KB -> ${kb((await stat(hero)).size)}KB  (720p, 14s)`);

// ------------------------------------------------------- about artwork
// Lossless, so the client's design is byte-for-byte the same picture.
const about = path.join(ROOT, "public", "brand", "about.png");
const aboutWebp = about.replace(/\.png$/, ".webp");
const aBefore = (await stat(about)).size;
await run("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-i", about, "-lossless", "1", aboutWebp,
]);
const aAfter = (await stat(aboutWebp)).size;
if (aAfter < aBefore) {
  await unlink(about);
  console.log(`about    ${kb(aBefore)}KB -> ${kb(aAfter)}KB  (lossless webp)`);
} else {
  await unlink(aboutWebp);
  console.log(`about    kept png (${kb(aBefore)}KB; lossless webp was larger)`);
}

// Point the code at .webp posters.
const assetLib = path.join(ROOT, "src", "lib", "asset.ts");
const before = await readFile(assetLib, "utf8");
const after = before.replace("/media/poster/${name}.jpg", "/media/poster/${name}.webp");
if (after !== before) {
  await writeFile(assetLib, after);
  console.log("asset.ts now points at .webp posters");
}
