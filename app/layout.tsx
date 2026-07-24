import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Loader from "@/components/ui/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NOVA — Think faster. Build smarter.",
    template: "%s · NOVA",
  },
  description:
    "Your intelligent workspace for turning ideas into action — powered by AI, designed for focus.",
  keywords: ["AI workspace", "productivity", "automation", "NOVA"],
  openGraph: {
    title: "NOVA — Think faster. Build smarter.",
    description:
      "Your intelligent workspace for turning ideas into action — powered by AI, designed for focus.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050609",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full bg-ink-950 font-sans text-mist-100 selection:text-mist-50">
        <Loader />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
