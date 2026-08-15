import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import LanguageProvider from "@/components/providers/LanguageProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Loader from "@/components/ui/Loader";
import Nav from "@/components/ui/Nav";
import WhatsApp from "@/components/ui/WhatsApp";
import { site } from "@/data/content";
import "./globals.css";

/*
  One typeface for the whole site: Thmanyah. It replaced a four-family stack
  (Jost / Instrument Serif / JetBrains Mono / Tajawal) because those were Latin
  faces with Arabic bolted on, and the small tracked-out labels broke apart on
  a phone in Arabic. Thmanyah is drawn for Arabic and Latin together, so both
  scripts hold at any size.

  Serif Display carries the headlines; Sans carries body copy and the small
  labels, where a serif at 10px turns to mud.

  Served through next/font/local rather than a hand-written @font-face: Next
  then owns the emitted URLs, so the base path stays defined in exactly two
  places instead of three.
*/
const display = localFont({
  src: "../fonts/thmanyah-display.woff2",
  variable: "--font-display-face",
  display: "swap",
  // Arabic and Latin both come from this file; no fallback should ever paint.
  adjustFontFallback: false,
});

const sans = localFont({
  src: "../fonts/thmanyah-sans.woff2",
  variable: "--font-sans-face",
  display: "swap",
  adjustFontFallback: false,
});

const sansMedium = localFont({
  src: "../fonts/thmanyah-sans-medium.woff2",
  variable: "--font-sans-medium-face",
  display: "swap",
  adjustFontFallback: false,
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
      className={`${display.variable} ${sans.variable} ${sansMedium.variable}`}
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
