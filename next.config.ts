import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

const remotePatterns: RemotePattern[] = [
  // Sample photography; the query must match lib/site-images.ts exactly.
  { protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-*", search: "?auto=format&fit=crop&w=1600&q=80" }
];

// Listing photos uploaded to the project's public Supabase Storage buckets.
if (process.env.SUPABASE_URL) {
  const { hostname } = new URL(process.env.SUPABASE_URL);
  remotePatterns.push({ protocol: "https", hostname, pathname: "/storage/v1/object/public/**", search: "" });
}

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory otherwise confuses root detection.
  turbopack: { root: __dirname },
  images: { remotePatterns, qualities: [75] }
};

export default nextConfig;
