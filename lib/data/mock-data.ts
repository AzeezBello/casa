import type { Property } from "../types";
import { unsplash as img } from "../site-images";

// Sample inventory used when Supabase isn't configured, and the source for supabase/seed.sql.
// IDs are fixed UUIDs so saved homes survive switching between the two backends.

const PHOTOS = {
  duplex: img("photo-1600585154340-be6161a56a0c"),
  terrace: img("photo-1600607687920-4e2a09cf159d"),
  family: img("photo-1600047509807-ba8f99d2cdde"),
  modular: img("photo-1600566753190-17f0baa2a6c3"),
  villa: img("photo-1600607688969-a5bfcd646154"),
  ocean: img("photo-1600607687939-ce8a6c25118c")
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "00000000-0000-4000-8000-000000000001", slug: "modern-4-bedroom-duplex-lekki", title: "Modern 4-Bedroom Duplex",
    area: "Lekki Phase 1", city: "Lagos", price: 185_000_000, type: "Duplex", beds: 4, baths: 4, size: 420,
    images: [PHOTOS.duplex, PHOTOS.ocean, PHOTOS.villa], tour: true, verified: true,
    description: "A light-filled duplex on a quiet close in Lekki Phase 1, with an open-plan living and dining space, a fitted kitchen with pantry, and a self-contained boys' quarters.",
    amenities: ["24/7 security", "Boys' quarters", "Fitted kitchen", "Parking for 3 cars", "Backup power"],
    agent: { name: "Adaeze Okafor", company: "Harbourline Realty" }
  },
  {
    id: "00000000-0000-4000-8000-000000000002", slug: "smart-3-bedroom-terrace-ikoyi", title: "Smart 3-Bedroom Terrace",
    area: "Ikoyi", city: "Lagos", price: 120_000_000, type: "Terrace", beds: 3, baths: 3, size: 280,
    images: [PHOTOS.terrace, PHOTOS.duplex, PHOTOS.family], tour: true, verified: true,
    description: "A terrace home in a gated Ikoyi estate with smart lighting, solar-ready wiring and a private roof terrace.",
    amenities: ["Gated estate", "Smart lighting", "Roof terrace", "Solar-ready", "Water treatment"],
    agent: { name: "Tunde Bakare", company: "Island Homes" }
  },
  {
    id: "00000000-0000-4000-8000-000000000003", slug: "contemporary-family-home-abuja", title: "Contemporary Family Home",
    area: "Gwarinpa", city: "Abuja", price: 95_000_000, type: "Detached", beds: 4, baths: 3, size: 350,
    images: [PHOTOS.family, PHOTOS.terrace, PHOTOS.modular], tour: false, verified: false,
    description: "A detached family home on a generous plot with a landscaped garden, a study and a detached guest chalet.",
    amenities: ["Garden", "Study", "Guest chalet", "Borehole"],
    agent: { name: "Hauwa Musa", company: "Capital Keys" }
  },
  {
    id: "00000000-0000-4000-8000-000000000004", slug: "compact-modular-home-ibeju-lekki", title: "Compact Modular Home",
    area: "Ibeju-Lekki", city: "Lagos", price: 28_000_000, type: "Modular", beds: 2, baths: 2, size: 95,
    images: [PHOTOS.modular, PHOTOS.terrace, PHOTOS.family], tour: true, verified: true,
    description: "A factory-built two-bedroom home with insulated panels, efficient ventilation and a short on-site build time.",
    amenities: ["Insulated panels", "Solar package option", "Short build time", "Configurable finishes"],
    agent: { name: "CASA Modular", company: "CASA" }
  },
  {
    id: "00000000-0000-4000-8000-000000000005", slug: "premium-5-bedroom-villa-maitama", title: "Premium 5-Bedroom Villa",
    area: "Maitama", city: "Abuja", price: 310_000_000, type: "Villa", beds: 5, baths: 5, size: 640,
    images: [PHOTOS.villa, PHOTOS.duplex, PHOTOS.ocean], tour: true, verified: true,
    description: "A villa in Maitama with double-height reception rooms, a pool, a cinema room and staff quarters.",
    amenities: ["Swimming pool", "Cinema room", "Staff quarters", "Elevator", "Backup power"],
    agent: { name: "Ibrahim Sani", company: "Capital Keys" }
  },
  {
    id: "00000000-0000-4000-8000-000000000006", slug: "oceanview-3-bedroom-home-victoria-island", title: "Oceanview 3-Bedroom Home",
    area: "Victoria Island", city: "Lagos", price: 165_000_000, type: "Apartment", beds: 3, baths: 3, size: 240,
    images: [PHOTOS.ocean, PHOTOS.villa, PHOTOS.duplex], tour: true, verified: false,
    description: "A high-floor apartment with sea views, a wraparound balcony and access to a residents' gym and pool.",
    amenities: ["Sea view", "Gym", "Shared pool", "Concierge", "Elevator"],
    agent: { name: "Adaeze Okafor", company: "Harbourline Realty" }
  }
];

/** Sample agents get reserved example.com inboxes, so seeded data can never email a real person. */
export function sampleAgentEmail(agentName: string): string {
  return `${agentName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@example.com`;
}
