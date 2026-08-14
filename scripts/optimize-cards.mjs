// Rebuilds the grid proxies in public/media/card from the full-quality files.
//
// A tile is never more than ~380px wide on screen and is silent, so shipping a
// full-length 480p copy of a two-and-a-half minute film to sit in a grid is
// pure waste. Each proxy is capped at LOOP_SECONDS and encoded small; the
// complete piece is one click away in the lightbox.

import { execFile } from "node:child_process";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const FULL = path.join(ROOT, "public", "media", "full");
const CARD = path.join(ROOT, "public", "media", "card");

const LOOP_SECONDS = 12;
const SHORT_EDGE = 400;

const files = (await readdir(FULL)).filter((f) => f.endsWith(".mp4"));
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(FULL, file);
  const dest = path.join(CARD, file);
  const tmp = path.join(CARD, `~${file}`);

  before += (await stat(dest).catch(() => ({ size: 0 }))).size;

  const probe = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0",
    src,
  ]);
  const [w, h] = probe.stdout.trim().split(",").map(Number);
  const scale = h > w ? `scale=${SHORT_EDGE}:-2` : `scale=-2:${SHORT_EDGE}`;

  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-t", String(LOOP_SECONDS),
    "-i", src,
    "-vf", `${scale},fps=24`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "30",
    "-profile:v", "main", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    tmp,
  ]);

  await unlink(dest).catch(() => {});
  await rename(tmp, dest);

  const size = (await stat(dest)).size;
  after += size;
  console.log(`${file.padEnd(26)} ${(size / 1048576).toFixed(2)} MB`);
}

console.log(
  `\ncard tier ${(before / 1048576).toFixed(0)} MB -> ${(after / 1048576).toFixed(0)} MB`,
);
