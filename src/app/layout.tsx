import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/content";
import { ContentProvider } from "@/components/providers/content";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  const title = `${site.name} — ${site.role}`;

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s — ${site.name}` },
    description: site.tagline,
    keywords: [
      site.name,
      site.role,
      "Front-end Developer",
      "React Developer",
      "Next.js Developer",
      "React Native",
      site.location,
    ],
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: site.url,
      title,
      description: site.tagline,
      siteName: site.name,
    },
    twitter: { card: "summary_large_image", title, description: site.tagline },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
};

const NO_JS_CSS = `
  .intro-curtain { display: none !important; }
  main *, header * {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getContent();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased`}
    >
      <head>
        {/* Without JS, motion never clears the styles it sets from `initial`,
            and the intro curtain never lifts. Force both open. */}
        <noscript>
          <style>{NO_JS_CSS}</style>
        </noscript>
      </head>
      <body className="relative min-h-svh">
        <ContentProvider value={content}>{children}</ContentProvider>
      </body>
    </html>
  );
}
