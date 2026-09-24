"use server";

import { after } from "next/server";
import { repository } from "@/lib/data";
import { getProperty } from "@/lib/listings";
import { emailConfigured, notifyAgentOfViewing } from "@/lib/notify";
import { generateReference, lagosToday, validateViewingRequest, type ViewingErrors } from "@/lib/viewing";

export type ViewingRequestState =
  | { status: "idle" }
  | { status: "error"; errors: ViewingErrors }
  | { status: "success"; reference: string; delivery: "email" | "stored" | "preview" };

export async function requestViewing(_prev: ViewingRequestState, form: FormData): Promise<ViewingRequestState> {
  // Honeypot: real users never see or fill this field. Pretend success so bots don't adapt.
  if (String(form.get("website") ?? "")) return { status: "success", reference: generateReference(), delivery: "preview" };

  const parsed = validateViewingRequest(form, lagosToday());
  if (!parsed.ok) return { status: "error", errors: parsed.errors };
  const request = parsed.value;

  const property = await getProperty(request.slug);
  if (!property) return { status: "error", errors: { form: "This property is no longer available." } };

  const input = {
    propertyId: property.id, name: request.name, phone: request.phone,
    email: request.email, preferredDate: request.date, message: request.message
  };
  let reference = generateReference();
  let result = await repository.createViewingRequest({ reference, ...input });
  if (!result.ok && result.reason === "reference_taken") {
    // 31^8 references make this vanishingly rare; one retry is enough.
    reference = generateReference();
    result = await repository.createViewingRequest({ reference, ...input });
  }
  if (!result.ok) {
    return result.reason === "duplicate"
      ? { status: "error", errors: { date: "You’ve already requested a viewing of this home for that date." } }
      : { status: "error", errors: { form: "Something went wrong. Please try again." } };
  }

  after(() => notifyAgentOfViewing(reference, property, request));

  const delivery = !repository.persistent ? "preview" : emailConfigured() ? "email" : "stored";
  return { status: "success", reference, delivery };
}
