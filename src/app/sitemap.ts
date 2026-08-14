import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

const BASE = "https://attiamohamed.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({
      url: `${BASE}/work/${project.slug}/`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
