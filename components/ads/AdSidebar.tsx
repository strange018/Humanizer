"use client";

import { useEffect } from "react";

interface AdSidebarProps {
  slot?: string;
  className?: string;
}

export function AdSidebar({ slot, className }: AdSidebarProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adsenseId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense load error", e);
      }
    }
  }, [adsenseId]);

  if (adsenseId) {
    return (
      <div className={`flex flex-col items-center justify-center border-l bg-card p-4 min-h-[600px] w-[300px] shrink-0 ${className}`}>
        <span className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Advertisement</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adsenseId}
          data-ad-slot={slot || "sidebar-slot"}
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
