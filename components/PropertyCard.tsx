import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, MapPin, Play, ShieldCheck } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { SaveButton } from "./SaveButton";

export function PropertyCard({ property: p, preload = false }: { property: Property; preload?: boolean }) {
  return (
    <article className="property-card">
      <div className="property-image">
        <Image src={p.images[0]} alt="" fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" preload={preload}/>
        <span className="type-pill">{p.type}</span>
        <SaveButton id={p.id} title={p.title}/>
        {p.tour && <span className="tour-pill"><Play size={13} fill="currentColor" aria-hidden="true"/> 360° Tour</span>}
      </div>
      <div className="property-info">
        <div className="price-line"><strong>{formatNaira(p.price)}</strong><span>for sale</span></div>
        <h3><Link href={`/properties/${p.slug}`} className="card-link">{p.title}</Link></h3>
        <p className="location"><MapPin size={15} aria-hidden="true"/>{p.area}, {p.city}</p>
        <div className="meta">
          <span><BedDouble size={16} aria-hidden="true"/>{p.beds} beds</span>
          <span><Bath size={16} aria-hidden="true"/>{p.baths} baths</span>
          {p.verified && <span className="verified"><ShieldCheck size={16} aria-hidden="true"/>Verified</span>}
        </div>
      </div>
    </article>
  );
}
