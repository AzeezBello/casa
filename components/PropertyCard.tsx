import { Img } from "@/components/Img";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Play, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { SaveButton } from "./SaveButton";
import { Badge } from "./ui/badge";
import { Tooltip } from "./ui/tooltip";

export function PropertyCard({ property: p, preload = false }: { property: Property; preload?: boolean }) {
  return (
    <article className="property-card">
      <div className="property-image">
        <Img
          src={p.images[0]}
          alt={p.title}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          preload={preload}
        />
        <Badge variant="default" className="type-pill">
          {p.type}
        </Badge>
        <SaveButton id={p.id} title={p.title} />
        {p.tour && (
          <Tooltip content="Explore interactive 360° virtual tour">
            <span className="tour-pill">
              <Play size={13} fill="currentColor" aria-hidden="true" /> 360° Tour
            </span>
          </Tooltip>
        )}
      </div>
      <div className="property-info">
        <div className="price-line">
          <strong>{formatNaira(p.price)}</strong>
          <span>for sale</span>
        </div>
        <h3>
          <Link href={`/properties/${p.slug}`} className="card-link">
            {p.title}
          </Link>
        </h3>
        <p className="location">
          <MapPin size={15} aria-hidden="true" />
          {p.area}, {p.city}
        </p>
        <div className="meta">
          <span>
            <BedDouble size={16} aria-hidden="true" />
            {p.beds} beds
          </span>
          <span>
            <Bath size={16} aria-hidden="true" />
            {p.baths} baths
          </span>
          {p.verified && (
            <Tooltip content="Verified listing: Ownership and documentation inspected by Casa">
              <span className="verified">
                <ShieldCheck size={16} aria-hidden="true" />
                Verified
              </span>
            </Tooltip>
          )}
        </div>
      </div>
    </article>
  );
}
