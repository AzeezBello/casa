import React from "react";
import { resolveSiteUrl } from "@/lib/site-url";

type Props = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
};

export function Meta({
  canonical,
  ogImage,
}: Props) {
  const siteUrl = resolveSiteUrl().toString().replace(/\/$/, "");
  const image = ogImage ? (ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`) : `${siteUrl}/og-image.png`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Casa Real Estate",
    description: "A Nigerian real estate discovery platform for homes, modular housing and virtual property tours.",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image,
    telephone: "+2348030002272",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Victoria Island",
      addressLocality: "Lagos",
      addressRegion: "Lagos State",
      addressCountry: "NG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "6.4281",
      longitude: "3.4219",
    },
    sameAs: [
      "https://twitter.com/casanigeria",
      "https://instagram.com/casanigeria",
    ],
  };

  return (
    <>
      {canonical && <link rel="canonical" href={canonical} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
