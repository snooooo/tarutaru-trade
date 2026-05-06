import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaruTaruTrade",
  description: "Whisky bottle trade board powered by MaltPeri.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div style={{
          background: "#ff6b00",
          color: "#fff",
          textAlign: "center",
          padding: "8px 16px",
          fontSize: "13px",
          fontWeight: "bold",
          letterSpacing: "0.03em",
          lineHeight: "1.6",
        }}>
          🚧 試験運転中 — 表示されているデータはすべてサンプルです
        </div>
        {children}
      </body>
    </html>
  );
}
