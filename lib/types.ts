export type PropertyType = "Duplex" | "Terrace" | "Detached" | "Modular" | "Villa" | "Apartment";
export type City = "Lagos" | "Abuja";

export type Property = {
  id: string;
  slug: string;
  title: string;
  area: string;
  city: City;
  /** Asking price in naira. */
  price: number;
  type: PropertyType;
  beds: number;
  baths: number;
  /** Floor area in square metres. */
  size: number;
  images: string[];
  tour: boolean;
  verified: boolean;
  description: string;
  amenities: string[];
  agent: { name: string; company: string };
};

export type SortKey = "newest" | "price-asc" | "price-desc";

export type PropertyFilters = {
  q?: string;
  type?: PropertyType;
  city?: City;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  tour?: boolean;
  sort?: SortKey;
};
