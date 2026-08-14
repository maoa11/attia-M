import type { Metadata, Viewport } from "next";
import { Jost, Instrument_Serif, JetBrains_Mono, Tajawal } from "next/font/google";
import LanguageProvider from "@/components/providers/LanguageProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Loader from "@/components/ui/Loader";
import Nav from "@/components/ui/Nav";
import WhatsApp from "@/components/ui/WhatsApp";
import { site } from "@/data/content";
import "./globals.css";

/*
  Jost is the working horse: a geometric sans that, set light and widely
  tracked, is the closest match to the lockup Attia designed for his own
  Behance banner. Instrument Serif italic is the one editorial voice allowed
  in — used for single words, never paragraphs. JetBrains Mono handles the
  shot-list micro type, and Tajawal carries Arabic.
*/
const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jetbrains",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://attiamohamed.com"),
  title: {
    default: `${site.name} — Videographer & Video Editor, Jeddah`,
    template: `%s — ${site.name}`,
  },
  description:
    "Attia Mohamed is a videographer and video editor in Jeddah, Saudi Arabia. Commercial video, brand films and short-form built for the scroll — 30+ brands, 250+ videos delivered.",
  keywords: [
    "videographer Jeddah",
    "video editor Saudi Arabia",
    "commercial video",
    "brand film",
    "reels",
    "مصور فيديو جدة",
    "مونتير فيديو",
  ],
  authors: [{ name: site.name, url: site.behance }],
  openGraph: {
    type: "website",
    title: `${site.name} — Videographer & Video Editor`,
    description:
      "Commercial video, brand films and short-form built for the scroll. Jeddah, Saudi Arabia.",
    siteName: site.name,
    locale: "en_US",
    alternateLocale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Videographer & Video Editor`,
    description: "Commercial video and brand films. Jeddah, Saudi Arabia.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${jost.variable} ${instrument.variable} ${jetbrains.variable} ${tajawal.variable}`}
      suppressHydrationWarning
    >
      <body>
        <LanguageProvider>
          <SmoothScroll>
            <Loader />
            <Cursor />
            <Nav />
            <main>{children}</main>
            <WhatsApp />
          </SmoothScroll>
        </LanguageProvider>
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
