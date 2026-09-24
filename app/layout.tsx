import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { resolveSiteUrl } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: { default: "Casa — Find a place that feels like home", template: "%s · Casa" },
  description: "A Nigerian real estate discovery platform for homes, modular housing and virtual property tours."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader/>
        <main id="main">{children}</main>
        <SiteFooter/>
      </body>
    </html>
  );
}
