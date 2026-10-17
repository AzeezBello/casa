import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { resolveSiteUrl } from "@/lib/site-url";
import "./globals.css";
import { Meta } from "@/components/Meta";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Onboarding } from "@/components/Onboarding";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: { default: "Casa — Find a place that feels like home", template: "%s · Casa" },
  description: "A Nigerian real estate discovery platform for homes, modular housing and virtual property tours.",
  applicationName: "Casa",
  openGraph: {
    title: "Casa — Find a place that feels like home",
    description: "A Nigerian real estate discovery platform for homes, modular housing and virtual property tours.",
    url: "/",
    siteName: "Casa Real Estate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Casa — Find a place that feels like home",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa — Find a place that feels like home",
    description: "A Nigerian real estate discovery platform for homes, modular housing and virtual property tours.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <Meta
          title="Casa – Real Estate Platform"
          description="Search homes, modular houses and virtual tours across Nigeria."
          canonical={process.env.NEXT_PUBLIC_SITE_URL}
          ogImage="/og-image.png"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <Breadcrumbs />
        <main id="main">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <SiteFooter />
        <Onboarding />
      </body>
    </html>
  );
}
