"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import { useSaved } from "@/lib/saved";

const links = [
  { href: "/properties", label: "Find a Home" },
  { href: "/properties?type=Modular", label: "Modular Homes" },
  { href: "/properties?tour=1", label: "Virtual Tours" },
  { href: "/#insights", label: "Market Insights" }
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { saved } = useSaved();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="nav">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true">C</span><span>CASA</span></Link>
      <nav id="primary-nav" className={open ? "nav-links open" : "nav-links"} aria-label="Primary">
        {links.map(l => <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>)}
      </nav>
      <div className="nav-actions">
        <Link className="ghost-btn saved-link" href="/saved">
          <Heart size={17} aria-hidden="true"/> Saved{saved.length > 0 && <span className="count">{saved.length}</span>}
        </Link>
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-nav"
        >
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
    </header>
  );
}
