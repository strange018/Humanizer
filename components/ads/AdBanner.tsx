"use client";

import { useEffect, useState, useRef } from "react";

interface AdBannerProps {
  slot?: string;
  className?: string;
}

export function AdBanner({ slot, className }: AdBannerProps) {
  const [adBlocked, setAdBlocked] = useState(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // Resolve numeric slot ID from env variables if configured
  let resolvedSlot = slot;
  if (adsenseId) {
    if (slot === "dashboard-top" || slot === "history-top") {
      resolvedSlot = process.env.NEXT_PUBLIC_ADSENSE_BANNER_TOP_SLOT || slot;
    } else if (slot === "dashboard-bottom" || slot === "history-bottom") {
      resolvedSlot = process.env.NEXT_PUBLIC_ADSENSE_BANNER_BOTTOM_SLOT || slot;
    } else {
      resolvedSlot = process.env.NEXT_PUBLIC_ADSENSE_DEFAULT_SLOT || slot || "default-slot";
    }
  }

  const insRef = useRef<HTMLModElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (adsenseId && insRef.current) {
      const checkAndPush = () => {
        if (insRef.current && insRef.current.offsetWidth >= 250) {
          // Prevent multiple pushes on the same element
          if (initializedRef.current || insRef.current.hasAttribute("data-adsbygoogle-status")) {
            return true;
          }
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            initializedRef.current = true;
            return true; // Pushed successfully
          } catch (e) {
            console.error("AdSense load error", e);
            setAdBlocked(true);
          }
        }
        return false;
      };

      // Try immediately
      const success = checkAndPush();
      if (success) return;

      // If not visible/rendered yet, wait using ResizeObserver
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width >= 250) {
            const ok = checkAndPush();
            if (ok) {
              observer.disconnect();
            }
          }
        }
      });

      observer.observe(insRef.current);
      return () => observer.disconnect();
    }
  }, [adsenseId]);

  // If AdSense is configured, render the standard Google Ads code
  if (adsenseId) {
    const isDev = process.env.NODE_ENV === "development";
    return (
      <div className={`my-4 flex justify-center overflow-hidden w-full max-w-4xl mx-auto h-[50px] sm:h-[90px] relative ${isDev ? "border border-dashed border-border/80 bg-muted/20 rounded-xl" : ""} ${className || ""}`}>
        {isDev && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-[10px] font-semibold text-muted-foreground select-none">
            Google AdSense Banner Slot (Live on approved domain)
          </div>
        )}
        <ins
          ref={insRef}
          className="adsbygoogle w-full h-[50px] sm:h-[90px]"
          style={{ display: "block" }}
          data-ad-client={adsenseId}
          data-ad-slot={resolvedSlot}
          data-ad-format="horizontal"
          data-full-width-responsive="false"
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
