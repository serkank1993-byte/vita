import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Vita — Aile Yaşam Arşivi",
  description:
    "Ailenizin ev yönetimi, evcil hayvan, alışveriş, takvim, gelir/gider, sağlık ve dijital arşiv merkezi.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vita",
  },
};

export const viewport: Viewport = {
  themeColor: "#2f6b5a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
