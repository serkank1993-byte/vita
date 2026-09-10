import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vita — Aile Yaşam Arşivi",
  description: "Ailenizin ev yönetimi, evcil hayvan, alışveriş, takvim, gelir/gider, sağlık ve dijital arşiv merkezi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
