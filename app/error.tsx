"use client";

import { RefreshCw } from "lucide-react";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="section">
      <div className="empty" role="alert">
        <h1>Something went wrong</h1>
        <p>We couldn’t load this page. It’s usually temporary.</p>
        <button className="outline-btn" type="button" onClick={reset}><RefreshCw size={17} aria-hidden="true"/> Try again</button>
      </div>
    </div>
  );
}
