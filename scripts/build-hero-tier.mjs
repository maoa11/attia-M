// Builds public/media/big — the tier for video shown LARGE.
//
// The card proxies are 400px because they sit in a carousel at ~280px wide.
// Stretching one of those across a full-bleed hero is what made the opening
// look soft. Anything displayed full-width now pulls from big/ instead:
// 1080p on the long edge, silent, and capped in length so a hero still starts
// almost immediately.

import { execFile } from "node:child_process";
import { readdir, stat } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const FULL = path.join(ROOT, "public", "media", "full");
const BIG = path.join(ROOT, "public", "media", "big");

// Only the clip each page shows behind its title needs this treatment.
const HERO_CLIPS = [
  "istanbul-villa-1",
  "mastak-1",
  "velo-1",
  "engineering-tips-1",
  "albaraa-china-1",
  "personal-brand-1",
  "gurkan-steakhouse-1",
  "esimley-1",
  "almurah-1",
  "editing-project-1",
];

const CAP_SECONDS = 20;

await mkdir(BIG, { recursive: true });
let total = 0;

for (const name of HERO_CLIPS) {
  const src = path.join(FULL, `${name}.mp4`);
  const dest = path.join(BIG, `${name}.mp4`);

  const probe = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0",
    src,
  ]);
  const [w, h] = probe.stdout.trim().split(",").map(Number);
  // Long edge to 1080/1920 — a vertical hero fills far more screen height than
  // a horizontal one, so it needs the taller number.
  const scale = h > w ? "scale=1080:-2" : "scale=1920:-2";

  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-t", String(CAP_SECONDS),
    "-i", src,
    "-vf", scale,
    "-c:v", "libx264", "-preset", "slow", "-crf", "25",
    "-profile:v", "high", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    dest,
  ]);

  const size = (await stat(dest)).size;
  total += size;
  console.log(`${name.padEnd(24)} ${(size / 1048576).toFixed(2)} MB`);
}

console.log(`\nbig tier total ${(total / 1048576).toFixed(0)} MB`);
