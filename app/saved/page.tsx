import type { Metadata } from "next";
import { SavedList } from "@/components/SavedList";

export const metadata: Metadata = {
  title: "Your Saved Homes",
  description: "View and compare your shortlisted Nigerian properties, duplexes, and modular homes on Casa.",
  alternates: {
    canonical: "/saved",
  },
  openGraph: {
    title: "Your Saved Homes · Casa",
    description: "View and compare your shortlisted Nigerian properties.",
    url: "/saved",
  },
};

export default function SavedPage() {
  return (
    <div className="section">
      <div className="section-head">
        <div>
          <div className="eyebrow">YOUR SHORTLIST</div>
          <h1>Saved homes</h1>
        </div>
      </div>
      <SavedList />
    </div>
  );
}
