"use client";

import { REWRITE_MODES, type RewriteMode } from "@/lib/openai";
import { cn } from "@/lib/utils";

interface ModeSelectorProps {
  activeMode: RewriteMode;
  onChange: (mode: RewriteMode) => void;
  disabled?: boolean;
}

export function ModeSelector({ activeMode, onChange, disabled }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {(Object.keys(REWRITE_MODES) as RewriteMode[]).map((modeKey) => {
        const mode = REWRITE_MODES[modeKey];
        const isActive = activeMode === modeKey;

        return (
          <button
            key={modeKey}
            type="button"
            disabled={disabled}
            onClick={() => onChange(modeKey)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-all cursor-pointer select-none",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-[1.02]"
                : "bg-card text-foreground hover:bg-accent border-border hover:border-muted-foreground/30",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <span>{mode.emoji}</span>
            <span className="font-semibold">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
