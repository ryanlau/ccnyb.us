import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ccnyb.us",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: "https://ccnyb.us/stop/125",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
    {
      url: "https://ccnyb.us/stop/145",
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.8,
    },
  ];
}
