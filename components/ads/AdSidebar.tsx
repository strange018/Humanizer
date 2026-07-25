"use client";

import { useEffect, useRef } from "react";

interface AdSidebarProps {
  slot?: string;
  className?: string;
}

export function AdSidebar({ slot, className }: AdSidebarProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  // Resolve numeric slot ID from env variables if configured
  let resolvedSlot = slot;
  if (adsenseId) {
    if (slot === "dashboard-sidebar" || slot === "history-sidebar") {
      resolvedSlot = process.env.NEXT_PUBLIC_ADSENSE_SIDEBAR_SLOT || slot;
    } else {
      resolvedSlot = process.env.NEXT_PUBLIC_ADSENSE_DEFAULT_SLOT || slot || "sidebar-slot";
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

  if (adsenseId) {
    const isDev = process.env.NODE_ENV === "development";
    return (
      <div className={`flex flex-col items-center justify-center border-l bg-card p-4 min-h-[600px] w-[300px] shrink-0 relative ${isDev ? "border-2 border-dashed border-border" : ""} ${className || ""}`}>
        {isDev && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-xs font-semibold text-muted-foreground text-center p-4 select-none">
            <span className="mb-2">Google AdSense Sidebar Slot</span>
            <span className="text-[10px] text-muted-foreground/60">(Live only on approved domain)</span>
          </div>
        )}
        <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Advertisement</span>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={adsenseId}
          data-ad-slot={resolvedSlot}
          data-ad-format="vertical"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  return (
    <div
      className={`hidden lg:flex flex-col justify-between border border-border/80 bg-card/60 rounded-xl p-5 w-[280px] shrink-0 min-h-[400px] relative glow ${className}`}
    >
      <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground uppercase bg-muted/80 rounded-bl-lg border-l border-b tracking-wider">
        Sponsor
      </div>

      <div className="space-y-4 mt-2">
        <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
          Recommended Tool
        </span>
        <div className="h-32 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 rounded-lg flex items-center justify-center border border-primary/10">
          <span className="text-3xl">📝</span>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-foreground">
            AI Detector Bypass
          </h4>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
            Ensure your text is certified human-like. Automatically test against major AI detectors like Turnitin, GPTZero, and Copyleaks.
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border/60">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Originality Score:</span>
          <span className="font-semibold text-green-500">99.8% Human</span>
        </div>
        <button
          onClick={() => alert("Detection reporting is included free with all humanized rewrites!")}
          className="w-full py-2 text-xs font-semibold bg-secondary hover:bg-accent text-foreground transition-all rounded-lg border cursor-pointer text-center"
        >
          Check Bypass Status
        </button>
      </div>
    </div>
  );
}
