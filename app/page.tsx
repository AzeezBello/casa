import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { HeroSearch } from "@/components/HeroSearch";
import { PropertyCard } from "@/components/PropertyCard";
import { TourDialog } from "@/components/TourDialog";
import { CITIES, getProperties } from "@/lib/listings";
import { HERO_IMAGE, MODULAR_IMAGE } from "@/lib/site-images";
import { formatNaira } from "@/lib/format";

// Listings change in the database; rebuild these pages at most every 5 minutes.
export const revalidate = 300;

export default async function HomePage() {
  const all = await getProperties();
  const withTours = all.filter(p => p.tour);
  const cheapestModular = Math.min(...all.filter(p => p.type === "Modular").map(p => p.price));

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} aria-hidden="true"/> PROPERTY DISCOVERY, REIMAGINED</div>
          <h1>Find a place that <em>feels</em> like home.</h1>
          <p>Discover properties, tour homes virtually, explore modular living and understand the Nigerian property market — all in one place.</p>
          <HeroSearch/>
          <div className="trust-row"><ShieldCheck size={17} aria-hidden="true"/> Verified badges on checked listings <span aria-hidden="true">•</span> <CheckCircle2 size={17} aria-hidden="true"/> Prices shown upfront</div>
        </div>
        <div className="hero-visual">
          <div className="hero-image">
            <Image src={HERO_IMAGE} alt="Modern two-storey home with a landscaped front garden" fill sizes="(max-width: 900px) 100vw, 50vw" preload/>
            <Link href="/properties?tour=1" className="floating-card tour-card">
              <span className="play" aria-hidden="true"><Play size={14} fill="currentColor"/></span>
              <span><strong>Take a virtual tour</strong><small>Explore before you visit</small></span>
            </Link>
            {Number.isFinite(cheapestModular) && (
              <Link href="/properties?type=Modular" className="floating-card price-card"><small>Featured from</small><strong>{formatNaira(cheapestModular)}</strong><span>Modular homes</span></Link>
            )}
          </div>
        </div>
      </section>

      <section className="stats" aria-label="At a glance">
        <div><strong>{all.length}</strong><span>Homes listed</span></div>
        <div><strong>{withTours.length}</strong><span>Virtual tours</span></div>
        <div><strong>{CITIES.length}</strong><span>Cities covered</span></div>
        <div><strong>₦</strong><span>Prices in naira</span></div>
      </section>

      <section className="section" id="homes">
        <div className="section-head">
          <div><div className="eyebrow">DISCOVER</div><h2>Homes worth exploring</h2><p>Browse properties matched to the way you want to live.</p></div>
          <Link className="outline-btn" href="/properties">View all <ArrowRight size={17} aria-hidden="true"/></Link>
        </div>
        <div className="property-grid">
          {all.slice(0, 6).map((p, i) => <PropertyCard key={p.id} property={p} preload={i < 3}/>)}
        </div>
      </section>

      <section className="modular" id="modular">
        <div className="modular-image"><Image src={MODULAR_IMAGE} alt="Bright modern interior with an open living space" fill sizes="(max-width: 900px) 100vw, 50vw"/></div>
        <div className="modular-copy">
          <div className="eyebrow">CASA MODULAR</div>
          <h2>Build the home you need, not the home you have to settle for.</h2>
          <p>Explore modular homes designed around practical Nigerian living. A configurator with layouts, finishes and cost estimates is on the way.</p>
          <ul className="feature-list">
            <li><CheckCircle2 aria-hidden="true"/> Flexible floor plans</li><li><CheckCircle2 aria-hidden="true"/> Cost estimation</li><li><CheckCircle2 aria-hidden="true"/> Faster construction model</li><li><CheckCircle2 aria-hidden="true"/> Configurable finishes</li>
          </ul>
          <Link className="dark-btn" href="/properties?type=Modular">Explore modular homes <ArrowRight size={17} aria-hidden="true"/></Link>
        </div>
      </section>

      <section className="section tours" id="tours">
        <div className="section-head">
          <div><div className="eyebrow">VIRTUAL TOURS</div><h2>See it before you see it.</h2><p>Walk through selected properties remotely and shortlist only the homes worth visiting.</p></div>
        </div>
        <div className="tour-grid">
          {withTours.slice(0, 3).map(p => (
            <TourDialog key={p.id} className="tour-tile" title={p.title} location={`${p.area}, ${p.city}`} image={p.images[0]}>
              <Image src={p.images[0]} alt="" fill sizes="(max-width: 900px) 100vw, 33vw"/>
              <span className="tour-overlay">
                <span className="tour-play" aria-hidden="true"><Play size={18} fill="currentColor"/></span>
                <span><strong>{p.title}</strong><small>{p.area}, {p.city}</small></span>
              </span>
            </TourDialog>
          ))}
        </div>
      </section>

      <section className="insights" id="insights">
        <div className="insight-icon" aria-hidden="true"><Wallet size={25}/></div>
        <div><div className="eyebrow">MARKET INSIGHTS · COMING SOON</div><h2>Understand the market before you commit.</h2><p>Compare indicative asking prices, explore neighbourhood activity and learn the terminology behind Nigerian property transactions.</p></div>
        <Link className="outline-btn" href="/properties?sort=price-asc">Compare prices <ArrowRight size={17} aria-hidden="true"/></Link>
      </section>

      <section className="cta">
        <div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Your next address could be one search away.</h2><p>Save homes as you browse and come back to your shortlist any time.</p></div>
        <Link className="light-btn" href="/properties">Start browsing <ArrowRight size={17} aria-hidden="true"/></Link>
      </section>
    </>
  );
}
