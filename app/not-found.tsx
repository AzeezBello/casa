import Link from "next/link";
import { Compass, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found · Casa",
  description: "The page you requested could not be found. Explore verified homes and 360° virtual tours on Casa.",
};

export default function NotFound() {
  return (
    <div className="section">
      <div className="ui-empty-state" style={{ maxWidth: "620px", margin: "48px auto" }}>
        <div className="ui-empty-icon-wrap" aria-hidden="true">
          <Compass size={32} />
        </div>
        <div className="eyebrow" style={{ marginBottom: "6px" }}>ERROR 404</div>
        <h1 className="ui-empty-title" style={{ fontSize: "2.2rem" }}>
          We couldn’t find that page
        </h1>
        <p className="ui-empty-desc">
          The property link or address you entered may have moved, expired, or been unlisted. Here are some quick places to get back on track:
        </p>

        <div className="ui-empty-guide" style={{ marginBottom: "28px" }}>
          <div className="ui-empty-guide-header">
            <span>Popular destinations:</span>
          </div>
          <ul className="ui-empty-tips">
            <li>
              <span className="tip-bullet">1</span>
              <span><strong>Homes for sale:</strong> Browse verified houses and duplexes in Lagos & Abuja</span>
            </li>
            <li>
              <span className="tip-bullet">2</span>
              <span><strong>Virtual tours:</strong> Experience 360° walkthroughs from anywhere</span>
            </li>
            <li>
              <span className="tip-bullet">3</span>
              <span><strong>Modular living:</strong> Explore modern prefabricated construction options</span>
            </li>
          </ul>
        </div>

        <div className="ui-empty-actions">
          <Link href="/properties">
            <Button variant="default">
              Browse homes <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              <Home size={16} aria-hidden="true" /> Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
