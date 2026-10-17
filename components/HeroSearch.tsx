import { Building2, ChevronDown, Search } from "lucide-react";
import { PROPERTY_TYPES } from "@/lib/filters";
import { Button } from "./ui/button";

// Plain GET form: works without JavaScript and produces shareable /properties URLs.
export function HeroSearch() {
  return (
    <form className="search-panel" action="/properties" role="search" aria-label="Quick home search">
      <label className="search-field">
        <Search size={20} aria-hidden="true"/>
        <span className="sr-only">Location or keyword</span>
        <input name="q" placeholder="Search Lagos, Abuja, Lekki, Ikoyi..." maxLength={100}/>
      </label>
      <label className="select-field">
        <Building2 size={18} aria-hidden="true"/>
        <span className="sr-only">Property type</span>
        <select name="type" defaultValue="">
          <option value="">Any type</option>
          {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <ChevronDown size={16} aria-hidden="true"/>
      </label>
      <Button variant="default" type="submit" className="search-btn">
        <Search size={16} aria-hidden="true" /> Search homes
      </Button>
    </form>
  );
}
