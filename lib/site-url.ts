type Env = Record<string, string | undefined>;

/**
 * The site's public origin. Blank values count as unset (hosting dashboards often
 * save empty variables), and a bare domain like "casa.ng" gets https:// added.
 * Order: NEXT_PUBLIC_SITE_URL, then Vercel's production and deployment URLs, then localhost.
 */
export function resolveSiteUrl(env: Env = process.env): URL {
  const candidates: [string, string | undefined][] = [
    ["NEXT_PUBLIC_SITE_URL", env.NEXT_PUBLIC_SITE_URL],
    ["VERCEL_PROJECT_PRODUCTION_URL", env.VERCEL_PROJECT_PRODUCTION_URL],
    ["VERCEL_URL", env.VERCEL_URL]
  ];
  for (const [name, raw] of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
      if (!url.hostname.includes(".") && url.hostname !== "localhost") throw new Error("no domain");
      return new URL(url.origin);
    } catch {
      throw new Error(`${name} must be a URL like https://casa.ng (got "${value}").`);
    }
  }
  return new URL("http://localhost:3000");
}
