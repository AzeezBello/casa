import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/listings";
import { resolveSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl().toString().replace(/\/$/, "");
  const slugs = await getAllSlugs();

  const propertyUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/properties/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/saved`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...propertyUrls];
}
