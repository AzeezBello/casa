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
  /** New fields for 360° tours */
  tourType?: "none" | "iframe" | "self"; // type of tour
  tourUrl?: string; // URL to iframe or self‑hosted assets
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

// Saved searches
export type SavedSearch = {
  id: string;
  userId: string;
  name: string;
  filters: PropertyFilters;
  alertEnabled: boolean;
  alertFrequency: "daily" | "weekly" | "monthly";
  createdAt: string;
  updatedAt: string;
};

export type NewSavedSearch = {
  name: string;
  filters: PropertyFilters;
  alertEnabled?: boolean;
  alertFrequency?: "daily" | "weekly" | "monthly";
};

// Messaging
export type Message = {
  id: string;
  propertyId: string;
  agentId: string;
  sender: "buyer" | "agent";
  reference?: string; // buyer's viewing request reference
  content: string;
  sentAt: string;
};

export type NewMessage = {
  propertyId: string;
  agentId: string;
  sender: "buyer" | "agent";
  reference?: string;
  content: string;
};
