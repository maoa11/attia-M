// Re-encodes public/media/full — the tier the lightbox plays — to roughly half
// its size.
//
// It was produced at CRF 23 with no ceiling, which is generous for footage that
// streams over a phone connection: 239MB across eighteen clips, the largest a
// single 50MB file. CRF 26 with a bitrate cap holds visual quality on this
// material (it is already a second-generation encode from Behance's own
// stream) while making the repo and the viewer's download far lighter.
//
// Reads from public/media/full and writes back in place via a temp file, so a
// failed encode cannot leave a truncated video behind.

import { execFile } from "node:child_process";
import { readdir, stat, rename, unlink } from "node:fs/promises";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const FULL = path.join(ROOT, "public", "media", "full");

const CRF = "26";
const MAXRATE = "2600k";
const BUFSIZE = "5200k";

const files = (await readdir(FULL)).filter((f) => f.endsWith(".mp4")).sort();
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(FULL, file);
  const tmp = path.join(FULL, `~${file}`);
  const startSize = (await stat(src)).size;
  before += startSize;

  await run(
    "ffmpeg",
    [
      "-hide_banner", "-loglevel", "error", "-y",
      "-i", src,
      "-c:v", "libx264", "-preset", "slow",
      "-crf", CRF, "-maxrate", MAXRATE, "-bufsize", BUFSIZE,
      "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      // Audio is already lossy; re-encoding it again buys nothing, so copy it.
      "-c:a", "copy",
      tmp,
    ],
    { maxBuffer: 1 << 26 },
  );

  const endSize = (await stat(tmp)).size;
  // Never let a "compression" pass make a file bigger.
  if (endSize >= startSize) {
    await unlink(tmp);
    after += startSize;
    console.log(`${file.padEnd(26)} kept original (${(startSize / 1048576).toFixed(1)} MB)`);
    continue;
  }

  await unlink(src);
  await rename(tmp, src);
  after += endSize;
  console.log(
    `${file.padEnd(26)} ${(startSize / 1048576).toFixed(1)} -> ${(endSize / 1048576).toFixed(1)} MB`,
  );
}

console.log(
  `\nfull tier ${(before / 1048576).toFixed(0)} MB -> ${(after / 1048576).toFixed(0)} MB`,
);
