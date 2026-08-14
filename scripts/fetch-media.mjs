// Pulls every video from Attia Mohamed's Behance projects (Adobe CCV embeds),
// then produces three web assets per clip:
//   full/<slug>.mp4    highest rendition, with audio  -> lightbox player
//   card/<slug>.mp4    480p, silent                   -> grid autoplay proxies
//   poster/<slug>.jpg  first-frame poster             -> never show a black frame
//
// The M7MD build taught us that many concurrent <video> elements at full res
// kills the page; the card/ proxies exist purely so every visible tile can play.

import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public", "media");

// slug -> ordered CCV asset ids. The two Istanbul-villa and the two Gurkan
// galleries on Behance are the same shoot posted twice, so they collapse into
// one case study each.
const PROJECTS = {
  mastak: ["FRrJc4LbyFW", "KhFLf-ebJ3M"],
  velo: ["8Gm4pWumoWE", "-nVUWVAI_KZ"],
  "engineering-tips": ["7ShNGiKg5Lk", "5hk9ymA3Zxw", "ByE-jysDmfC"],
  "albaraa-china": ["LMSjzf5PNtx", "LcR_WypbzIs"],
  "personal-brand": ["UfqmrcVE74e", "6FRwhdygims"],
  "editing-project": ["QYKJpdnuAqt"],
  esimley: ["Ks_JhzSdcjd"],
  "istanbul-villa": ["AHBSIiCNoCt", "9wKrwU7zpnS"],
  "gurkan-steakhouse": ["T_K6pgnxdKT", "SSyjQbbBVFZ"],
  almurah: ["87jiJnanbbh"],
};

// The embed page carries short-lived signed URLs, so resolve them at run time
// rather than pasting tokens that expire in ~3 days.
async function resolve(id) {
  const res = await fetch(
    `https://www-ccv.adobe.io/v1/player/ccv/${id}/embed?api_key=behance1`,
  );
  if (!res.ok) throw new Error(`embed ${id}: HTTP ${res.status}`);
  const html = await res.text();
  const clean = (s) => s?.replace(/\\\//g, "/").replace(/&amp;/g, "&");

  const master = clean(html.match(/(https?:[^"'\s\\]*master\.m3u8[^"'\s\\]*)/)?.[1]);
  const poster = clean(html.match(/(https?:[^"'\s\\]*_poster\.jpg[^"'\s\\]*)/)?.[1]);
  if (!master) throw new Error(`embed ${id}: no manifest`);

  const manifest = await (await fetch(master)).text();
  const variants = [...manifest.matchAll(/RESOLUTION=(\d+)x(\d+)\s*\n(\S+)/g)].map(
    (m) => ({ w: +m[1], h: +m[2], path: m[3] }),
  );
  if (!variants.length) throw new Error(`embed ${id}: no variants`);
  const best = variants.sort((a, b) => b.w * b.h - a.w * a.h)[0];

  const [base, query] = master.split("?");
  const stream = `${base.replace(/master\.m3u8$/, "")}${best.path}?${query}`;
  return { stream, poster, width: best.w, height: best.h };
}

const ffmpeg = (args) =>
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    maxBuffer: 1 << 26,
  });

async function build(slug, id, index, meta) {
  const name = `${slug}-${index + 1}`;
  const vertical = meta.height > meta.width;

  // full: cap the long edge at 1080/1920 and keep audio for the lightbox.
  const fullScale = vertical ? "scale=-2:'min(1920,ih)'" : "scale='min(1920,iw)':-2";
  await ffmpeg([
    "-i", meta.stream,
    "-vf", fullScale,
    "-c:v", "libx264", "-preset", "slow", "-crf", "23",
    "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-c:a", "aac", "-b:a", "128k",
    path.join(OUT, "full", `${name}.mp4`),
  ]);

  // card: 480-ish silent proxy so every tile on screen can decode at once.
  const cardScale = vertical ? "scale=480:-2" : "scale=-2:480";
  await ffmpeg([
    "-i", meta.stream,
    "-vf", cardScale,
    "-c:v", "libx264", "-preset", "slow", "-crf", "27",
    "-profile:v", "main", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    "-an",
    path.join(OUT, "card", `${name}.mp4`),
  ]);

  await ffmpeg([
    "-i", meta.stream,
    "-frames:v", "1", "-q:v", "4",
    path.join(OUT, "poster", `${name}.jpg`),
  ]);

  const probe = await run("ffprobe", [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height:format=duration",
    "-of", "json",
    path.join(OUT, "full", `${name}.mp4`),
  ]);
  const info = JSON.parse(probe.stdout);
  return {
    name,
    ccv: id,
    width: info.streams[0].width,
    height: info.streams[0].height,
    duration: Math.round(+info.format.duration * 10) / 10,
  };
}

const results = {};
for (const dir of ["full", "card", "poster"]) {
  await mkdir(path.join(OUT, dir), { recursive: true });
}

for (const [slug, ids] of Object.entries(PROJECTS)) {
  results[slug] = [];
  for (const [i, id] of ids.entries()) {
    const name = `${slug}-${i + 1}`;
    if (existsSync(path.join(OUT, "card", `${name}.mp4`))) {
      console.log(`skip  ${name}`);
      continue;
    }
    try {
      const meta = await resolve(id);
      console.log(`fetch ${name}  ${meta.width}x${meta.height}`);
      results[slug].push(await build(slug, id, i, meta));
      console.log(`  ok  ${name}`);
    } catch (err) {
      console.error(`  FAIL ${name}: ${err.message}`);
    }
  }
}

await writeFile(
  path.join(ROOT, "_source", "media-manifest.json"),
  JSON.stringify(results, null, 2),
);
console.log("done");
