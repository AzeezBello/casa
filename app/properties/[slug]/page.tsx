import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bath, BedDouble, CheckCircle2, MapPin, Play, Ruler, ShieldCheck } from "lucide-react";
import { SaveButton } from "@/components/SaveButton";
import { TourDialog } from "@/components/TourDialog";
import { ViewingRequestForm } from "@/components/ViewingRequestForm";
import { getAllSlugs, getProperties, getProperty } from "@/lib/listings";
import { formatNaira } from "@/lib/format";
import { PropertyCard } from "@/components/PropertyCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getAllSlugs()).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProperty((await params).slug);
  if (!p) return { title: "Property not found" };
  const description = `${p.beds}-bedroom ${p.type.toLowerCase()} in ${p.area}, ${p.city} — ${formatNaira(p.price)}.`;
  return { title: p.title, description, openGraph: { title: p.title, description, images: [p.images[0]] } };
}

// Listings change in the database; rebuild these pages at most every 5 minutes.
export const revalidate = 300;

export default async function PropertyPage({ params }: Props) {
  const p = await getProperty((await params).slug);
  if (!p) notFound();
  const location = `${p.area}, ${p.city}`;
  const similar = (await getProperties({ city: p.city })).filter(s => s.id !== p.id).slice(0, 3);

  return (
    <div className="section detail">
      <Link href="/properties" className="back-link"><ArrowLeft size={16} aria-hidden="true"/> All homes</Link>

      <div className="gallery">
        {p.images.slice(0, 3).map((src, i) => (
          <div key={src} className={i === 0 ? "gallery-main" : "gallery-side"}>
            <Image src={src} alt={i === 0 ? p.title : ""} fill sizes={i === 0 ? "(max-width: 900px) 100vw, 66vw" : "33vw"} preload={i === 0}/>
          </div>
        ))}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-head">
            <div>
              <div className="eyebrow">{p.type.toUpperCase()} · FOR SALE</div>
              <h1>{p.title}</h1>
              <p className="location"><MapPin size={16} aria-hidden="true"/>{location}</p>
            </div>
            <SaveButton id={p.id} title={p.title} className="heart inline"/>
          </div>
          <p className="detail-price">{formatNaira(p.price)} <span>asking price</span></p>

          <ul className="facts">
            <li><BedDouble aria-hidden="true"/><strong>{p.beds}</strong> bedrooms</li>
            <li><Bath aria-hidden="true"/><strong>{p.baths}</strong> bathrooms</li>
            <li><Ruler aria-hidden="true"/><strong>{p.size}</strong> m²</li>
            {p.verified && <li className="verified"><ShieldCheck aria-hidden="true"/><strong>Verified</strong> listing</li>}
          </ul>

          {p.tour && (
            <TourDialog className="dark-btn" title={p.title} location={location} image={p.images[0]}>
              <Play size={16} fill="currentColor" aria-hidden="true"/> Open 360° tour
            </TourDialog>
          )}

          <h2>About this home</h2>
          <p>{p.description}</p>

          <h2>Features</h2>
          <ul className="amenities">
            {p.amenities.map(a => <li key={a}><CheckCircle2 size={18} aria-hidden="true"/>{a}</li>)}
          </ul>
        </div>

        <aside className="detail-aside" aria-labelledby="viewing-heading">
          <h2 id="viewing-heading">Book a viewing</h2>
          <p className="agent">Listed by <strong>{p.agent.name}</strong>, {p.agent.company}</p>
          <ViewingRequestForm slug={p.slug} agent={p.agent.name}/>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="similar" aria-labelledby="similar-heading">
          <h2 id="similar-heading">More homes in {p.city}</h2>
          <div className="property-grid">{similar.map(s => <PropertyCard key={s.id} property={s}/>)}</div>
        </section>
      )}
    </div>
  );
}
