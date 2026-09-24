import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">C</span><span>CASA</span></Link>
        <p>Property discovery, redesigned for Nigeria.</p>
      </div>
      <nav aria-label="Explore">
        <strong>Explore</strong>
        <Link href="/properties">All homes</Link>
        <Link href="/properties?type=Modular">Modular</Link>
        <Link href="/properties?tour=1">Virtual tours</Link>
      </nav>
      <nav aria-label="Cities">
        <strong>Cities</strong>
        <Link href="/properties?city=Lagos">Lagos</Link>
        <Link href="/properties?city=Abuja">Abuja</Link>
      </nav>
      <nav aria-label="Your account">
        <strong>You</strong>
        <Link href="/saved">Saved homes</Link>
      </nav>
      <p className="footer-note">Listings shown are sample data for this preview. Prices are indicative asking prices.</p>
    </footer>
  );
}
