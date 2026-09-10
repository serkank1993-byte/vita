import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vita — Aile Yaşam Arşivi",
    short_name: "Vita",
    description:
      "Ailenizin ev yönetimi, evcil hayvan, alışveriş, takvim, gelir/gider, sağlık ve dijital arşiv merkezi.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f9f8",
    theme_color: "#2f6b5a",
    lang: "tr",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
