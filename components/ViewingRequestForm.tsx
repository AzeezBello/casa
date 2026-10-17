"use client";

import { useActionState } from "react";
import { CheckCircle2, Send, Loader2 } from "lucide-react";
import { requestViewing, type ViewingRequestState } from "@/app/properties/[slug]/actions";
import { Button } from "./ui/button";

const initial: ViewingRequestState = { status: "idle" };

const DELIVERY_COPY: Record<Extract<ViewingRequestState, { status: "success" }>["delivery"], (agent: string) => string> = {
  email: agent => `${agent} has been notified and will contact you directly to confirm your viewing time.`,
  stored: agent => `Your viewing request is registered. The Casa advisory team will coordinate directly with ${agent}.`,
  preview: agent => `Your viewing request has been recorded. ${agent} will reach out to confirm availability.`
};

export function ViewingRequestForm({ slug, agent }: { slug: string; agent: string }) {
  const [state, action, pending] = useActionState(requestViewing, initial);

  if (state.status === "success") {
    return (
      <div className="form-success" role="status">
        <CheckCircle2 aria-hidden="true"/>
        <h3>Request received</h3>
        <p>Reference <strong>{state.reference}</strong>. {DELIVERY_COPY[state.delivery](agent)}</p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const field = (name: keyof typeof errors) => ({
    name,
    id: `vr-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `vr-${name}-error` : undefined
  });
  const error = (name: keyof typeof errors) =>
    errors[name] && <span className="field-error" id={`vr-${name}-error`}>{errors[name]}</span>;

  return (
    <form action={action} className="viewing-form" noValidate>
      <input type="hidden" name="slug" value={slug}/>
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      {errors.form && <p className="field-error" role="alert">{errors.form}</p>}
      <div className="field"><label htmlFor="vr-name">Full name</label><input {...field("name")} autoComplete="name" required/>{error("name")}</div>
      <div className="field"><label htmlFor="vr-phone">Phone</label><input {...field("phone")} type="tel" autoComplete="tel" placeholder="0803 123 4567" required/>{error("phone")}</div>
      <div className="field"><label htmlFor="vr-email">Email <span className="optional">(optional)</span></label><input {...field("email")} type="email" autoComplete="email"/>{error("email")}</div>
      <div className="field"><label htmlFor="vr-date">Preferred date</label><input {...field("date")} type="date" required/>{error("date")}</div>
      <div className="field"><label htmlFor="vr-message">Message <span className="optional">(optional)</span></label><textarea name="message" id="vr-message" rows={3} maxLength={1000}/></div>
      <Button variant="default" className="w-full" style={{ width: "100%" }} type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending request…
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" /> Request a viewing
          </>
        )}
      </Button>
    </form>
  );
}
