import type { Property, PropertyFilters, SavedSearch, NewSavedSearch, Message, NewMessage, NewViewingRequest, ViewingRequestStatus, CreateViewingResult } from "../types";

export type GeoBounds = {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
};

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
  // Saved‑searches
  listSavedSearches(userId: string): Promise<SavedSearch[]>;
  createSavedSearch(userId: string, data: NewSavedSearch): Promise<SavedSearch>;
  deleteSavedSearch(id: string): Promise<void>;
  // Messaging
  listMessages(propertyId: string): Promise<Message[]>;
  createMessage(msg: NewMessage): Promise<Message>;
  /** New: fetch properties within geographic bounds */
  listPropertiesByLocation(bounds: GeoBounds, filters?: PropertyFilters): Promise<Property[]>;
}
