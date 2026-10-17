import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link className="brand" href="/" aria-label="Casa Home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>CASA</span>
        </Link>
        <p>Property discovery and modular living, thoughtfully designed for Nigeria.</p>
      </div>
      <nav aria-label="Explore properties">
        <strong>Explore</strong>
        <Link href="/properties">All homes</Link>
        <Link href="/properties?type=Modular">Modular living</Link>
        <Link href="/properties?tour=1">360° Virtual tours</Link>
        <Link href="/#insights">Market insights</Link>
      </nav>
      <nav aria-label="Prime locations">
        <strong>Locations</strong>
        <Link href="/properties?city=Lagos">Lagos State</Link>
        <Link href="/properties?city=Abuja">Abuja FCT</Link>
        <Link href="/properties?q=Lekki">Lekki Peninsula</Link>
        <Link href="/properties?q=Ikoyi">Ikoyi Island</Link>
      </nav>
      <nav aria-label="Shortlist & Tools">
        <strong>Tools & Shortlist</strong>
        <Link href="/saved">Your saved homes</Link>
        <Link href="/sitemap.xml">Sitemap</Link>
        <Link href="/llms.txt">LLMs & Agents</Link>
      </nav>
      <p className="footer-note">
        © {new Date().getFullYear()} Casa Technologies Ltd. Verified Nigerian property listings, upfront Naira pricing, and immersive 360° virtual tours.
      </p>
    </footer>
  );
}
