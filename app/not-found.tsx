import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section">
      <div className="empty">
        <Home size={30} aria-hidden="true"/>
        <h1>We couldn’t find that page</h1>
        <p>The listing may have been sold or removed.</p>
        <Link className="outline-btn" href="/properties">Browse homes</Link>
      </div>
    </div>
  );
}
