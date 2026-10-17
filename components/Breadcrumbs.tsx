"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  // Don't render breadcrumbs on homepage
  if (parts.length === 0) return null;

  const crumbs = parts.map((part, i) => {
    let name = decodeURI(part).replace(/-/g, " ");
    if (name.length > 32) name = `${name.slice(0, 32)}…`;
    return {
      name,
      href: "/" + parts.slice(0, i + 1).join("/"),
    };
  });

  const all = [{ name: "Home", href: "/" }, ...crumbs];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://casa.ng").replace(/\/$/, "");

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${siteUrl}${c.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol className="breadcrumb-list">
          {all.map((c, i) => {
            const isLast = i === all.length - 1;
            return (
              <li key={c.href} className="breadcrumb-item">
                {i > 0 && <ChevronRight size={13} className="breadcrumb-separator" aria-hidden="true" />}
                {!isLast ? (
                  <Link href={c.href} className="breadcrumb-link">
                    {c.name}
                  </Link>
                ) : (
                  <span aria-current="page" className="breadcrumb-current">
                    {c.name}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
