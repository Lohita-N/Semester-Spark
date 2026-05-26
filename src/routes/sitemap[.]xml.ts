import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "daily" | "monthly";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/dashboard", changefreq: "daily", priority: "0.9" },
          { path: "/courses", changefreq: "weekly", priority: "0.8" },
          { path: "/gpa", changefreq: "weekly", priority: "0.8" },
          { path: "/analytics", changefreq: "weekly", priority: "0.7" },
          { path: "/assignments", changefreq: "daily", priority: "0.8" },
          { path: "/planner", changefreq: "daily", priority: "0.7" },
          { path: "/cooked", changefreq: "weekly", priority: "0.6" },
          { path: "/profile", changefreq: "monthly", priority: "0.4" },
        ];
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...entries.map((e) => `  <url><loc>${BASE_URL}${e.path}</loc>${e.changefreq?`<changefreq>${e.changefreq}</changefreq>`:""}${e.priority?`<priority>${e.priority}</priority>`:""}</url>`),
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});