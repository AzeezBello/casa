// src/components/Meta.tsx
"use client";

import Head from "next/head";

type Props = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
};

export function Meta({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
}: Props) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const url = canonical ?? siteUrl;
  const image = ogImage ?? `${siteUrl}/og-image.png`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Casa Real Estate",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image,
    telephone: "+1-555-123-4567",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main St",
      addressLocality: "Lagos",
      addressRegion: "NG",
      postalCode: "100001",
      addressCountry: "NG",
    },
    sameAs: [
      "https://twitter.com/casa",
      "https://facebook.com/casa",
    ],
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={ogType} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </Head>
  );
}
