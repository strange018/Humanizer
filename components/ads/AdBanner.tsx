"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
  slot?: string;
  className?: string;
}

export function AdBanner({ slot, className }: AdBannerProps) {
  const [adBlocked, setAdBlocked] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    // Check if real AdSense is configured and attempt to load it
    if (adsenseId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense load error", e);
        setAdBlocked(true);
      }
    }
  }, [adsenseId]);

  // If AdSense is configured, render the standard Google Ads code
  if (adsenseId) {
    return (
      <div className={`my-4 flex justify-center overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseId}
          data-ad-slot={slot || "default-slot"}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Fallback to a beautifully designed, user-friendly premium mockup ad
  return (
    <div
      className={`relative my-6 p-4 rounded-xl border border-border/80 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto glow ${className}`}
    >
      <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground uppercase bg-muted/80 rounded-bl-lg border-l border-b tracking-wider">
        Sponsor
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
          🚀
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-semibold text-sm text-foreground">
            Upgrade to Humanize AI Pro
          </h4>
          <p className="text-xs text-muted-foreground">
            Get unlimited word counts, faster response speeds, and advanced plagiarism bypass.
          </p>
        </div>
      </div>
      <a
        href="#"
        className="px-4 py-1.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg shadow-sm whitespace-nowrap cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          alert("Humanize AI is fully free for this demo! Pro features are automatically unlocked.");
        }}
      >
        Learn More
      </a>
    </div>
  );
}
