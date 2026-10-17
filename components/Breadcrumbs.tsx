// src/components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Breadcrumbs() {
  const pathname = usePathname(); // e.g. /properties/abc
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, i) => ({
    name: decodeURI(part).replace(/-/g, " "),
    href: "/" + parts.slice(0, i + 1).join("/"),
  }));

  const all = [{ name: "Home", href: "/" }, ...crumbs];

  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${c.href}`,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <ol className="flex space-x-2 text-sm">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center">
              {i > 0 && <span className="mx-1">/</span>}
              {i < all.length - 1 ? (
                <Link href={c.href} className="text-primary hover:underline">
                  {c.name}
                </Link>
              ) : (
                <span aria-current="page" className="text-gray-600">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
