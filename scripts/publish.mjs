// Copies the static export to the repo root, where GitHub Pages serves it.
//
// The one non-obvious step: Next names its asset folder `_next`, and Pages
// (deploying from a branch) runs the site through Jekyll, which silently drops
// every path beginning with an underscore. The result is an index.html that
// loads and a page that renders black because all its CSS and JS 404.
//
// `.nojekyll` is meant to prevent that and did not, so instead of depending on
// it the folder is renamed to `next` and every reference rewritten. Nothing
// then starts with an underscore and the Jekyll behaviour stops mattering.
// `.nojekyll` is still written as a belt-and-braces measure.

import { cp, readdir, rm, readFile, writeFile, stat, rename } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "out");

// Everything at the repo root that belongs to the published site. Cleared
// before each publish so a renamed chunk from an old build cannot linger.
const PUBLISHED = [
  "_next", "next", "work", "media", "brand",
  "index.html", "index.txt", "404.html", "404",
  "sitemap.xml", "robots.txt", "_not-found", ".nojekyll",
  "__next.__PAGE__.txt", "__next._full.txt", "__next._tree.txt",
];

const REWRITE_EXT = new Set([".html", ".js", ".css", ".json", ".txt", ".xml"]);

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

/** Every file under dir, recursively. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

if (!(await exists(OUT))) {
  console.error("no out/ — run `npm run build` first");
  process.exit(1);
}

for (const name of PUBLISHED) {
  await rm(path.join(ROOT, name), { recursive: true, force: true });
}

for (const entry of await readdir(OUT)) {
  await cp(path.join(OUT, entry), path.join(ROOT, entry), { recursive: true });
}

await rename(path.join(ROOT, "_next"), path.join(ROOT, "next"));

// Rewrite references in every text asset. Both the bare and the base-path
// forms appear, and JSON payloads carry escaped slashes too.
let touched = 0;
for (const file of await walk(ROOT).then((all) =>
  all.filter(
    (f) =>
      REWRITE_EXT.has(path.extname(f)) &&
      !f.includes(`${path.sep}node_modules${path.sep}`) &&
      !f.includes(`${path.sep}.git${path.sep}`) &&
      !f.includes(`${path.sep}out${path.sep}`) &&
      !f.includes(`${path.sep}src${path.sep}`) &&
      !f.includes(`${path.sep}public${path.sep}`),
  ),
)) {
  const before = await readFile(file, "utf8");
  const after = before
    .replaceAll("/_next/", "/next/")
    .replaceAll("\\/_next\\/", "\\/next\\/")
    .replaceAll('"_next/', '"next/');
  if (after !== before) {
    await writeFile(file, after);
    touched++;
  }
}

await writeFile(path.join(ROOT, ".nojekyll"), "");
await rm(OUT, { recursive: true, force: true });

const remaining = (await walk(path.join(ROOT, "next")))
  .concat(await walk(path.join(ROOT, "work")))
  .concat([path.join(ROOT, "index.html")]);
const stragglers = [];
for (const f of remaining) {
  if (!REWRITE_EXT.has(path.extname(f))) continue;
  if ((await readFile(f, "utf8")).includes("_next")) stragglers.push(f);
}

console.log(`rewrote ${touched} files`);
console.log(
  stragglers.length
    ? `WARNING: _next still referenced in:\n  ${stragglers.slice(0, 5).join("\n  ")}`
    : "no _next references remain",
);
