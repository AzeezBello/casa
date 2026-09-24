// Must match the images.remotePatterns allowlist in next.config.ts. The capped size
// matters: raw Unsplash originals are several MB and time out the image optimizer.
export const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const HERO_IMAGE = unsplash("photo-1600585154526-990dced4db0d");
export const MODULAR_IMAGE = unsplash("photo-1600607687920-4e2a09cf159d");
