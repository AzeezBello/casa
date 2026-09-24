import type { Metadata } from "next";
import { SavedList } from "@/components/SavedList";

export const metadata: Metadata = { title: "Saved homes" };

export default function SavedPage() {
  return (
    <div className="section">
      <div className="section-head"><div><div className="eyebrow">YOUR SHORTLIST</div><h1>Saved homes</h1></div></div>
      <SavedList/>
    </div>
  );
}
