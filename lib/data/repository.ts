import type { Property, PropertyFilters } from "../types";

export type NewViewingRequest = {
  reference: string;
  propertyId: string;
  name: string;
  /** E.164, e.g. +2348031234567 */
  phone: string;
  email?: string;
  /** YYYY-MM-DD */
  preferredDate: string;
  message?: string;
};

export type ViewingRequestStatus = "new" | "notified" | "notify_failed";

export type CreateViewingResult =
  | { ok: true }
  | { ok: false; reason: "duplicate" | "reference_taken" };

export interface Repository {
  /** False for the in-memory sample backend: nothing survives a restart. */
  readonly persistent: boolean;
  listProperties(filters: PropertyFilters): Promise<Property[]>;
  getPropertyBySlug(slug: string): Promise<Property | undefined>;
  getPropertiesByIds(ids: string[]): Promise<Property[]>;
  listSlugs(): Promise<string[]>;
  createViewingRequest(input: NewViewingRequest): Promise<CreateViewingResult>;
  setViewingRequestStatus(reference: string, status: ViewingRequestStatus): Promise<void>;
  getAgentEmail(propertyId: string): Promise<string | undefined>;
}
