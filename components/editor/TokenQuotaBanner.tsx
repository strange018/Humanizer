"use client";

import { AlertTriangle, Clock, Zap, X } from "lucide-react";

export interface QuotaState {
  used: number;
  limit: number;
  remaining: number;
  percentage: number;
  resetAt: string; // ISO string
  exhausted: boolean;
  authenticated: boolean;
}

interface TokenQuotaBannerProps {
  quota: QuotaState;
  onDismiss?: () => void;
  className?: string;
}

function formatResetTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getBarColor(pct: number) {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 75) return "bg-orange-500";
  if (pct >= 50) return "bg-amber-400";
  return "bg-emerald-500";
}

function getWrapperStyle(pct: number) {
  if (pct >= 100)
    return "border-red-500/30 bg-red-500/8 text-red-400";
  if (pct >= 75)
    return "border-orange-500/30 bg-orange-500/8 text-orange-400";
  return "border-amber-400/30 bg-amber-400/8 text-amber-500";
}

export function TokenQuotaBanner({ quota, onDismiss, className = "" }: TokenQuotaBannerProps) {
  const { percentage, used, limit, remaining, resetAt, exhausted } = quota;

  // Only show at 50 / 75 / 100 %
  if (percentage < 50) return null;

  const barColor = getBarColor(percentage);
  const wrapperStyle = getWrapperStyle(percentage);
  const resetFormatted = formatResetTime(resetAt);

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 animate-fade-in-up ${wrapperStyle} ${className}`}
      role="alert"
      aria-live="polite"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          {exhausted ? (
            <Clock className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-bold leading-snug">
              {exhausted
                ? "Daily quota exhausted"
                : percentage >= 75
                ? "Running low on tokens"
                : "Half your tokens used"}
            </p>
            <p className="text-xs opacity-80 mt-0.5 font-medium">
              {exhausted
                ? `Resets on ${resetFormatted}`
                : `${remaining.toLocaleString()} tokens remaining — resets ${resetFormatted}`}
            </p>
          </div>
        </div>

        {onDismiss && !exhausted && (
          <button
            onClick={onDismiss}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold opacity-75">
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {used.toLocaleString()} / {limit.toLocaleString()} tokens
          </span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} ${
              exhausted ? "animate-pulse" : ""
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Exhausted CTA */}
      {exhausted && (
        <div className="pt-1 flex flex-wrap gap-2">
          <a
            href="/dashboard"
            className="px-3 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-sm cursor-pointer transition-all hover:scale-[1.02] inline-flex items-center gap-1"
          >
            🚀 Upgrade to Pro
          </a>
          <span className="text-xs opacity-70 self-center">or wait until quota resets</span>
        </div>
      )}
    </div>
  );
}
