"use client";

import { useEffect, useState } from "react";
import { Sparkles, FileText } from "lucide-react";

export function InteractiveDemo() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [status, setStatus] = useState<"idle" | "typingInput" | "waitingToClick" | "loading" | "typingOutput" | "done">("idle");

  const originalPhrase = "It is important to remember that artificial intelligence is growing rapidly. Furthermore, in conclusion, it will impact all jobs.";
  const humanizedPhrase = "AI is moving fast. Honestly, it's pretty clear that it's going to change the way almost all of us work.";

  useEffect(() => {
    let active = true;

    const runSequence = async () => {
      while (active) {
        // 1. Reset
        setInputText("");
        setOutputText("");
        setStatus("typingInput");
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 2. Type original text
        for (let i = 0; i <= originalPhrase.length; i++) {
          if (!active) return;
          setInputText(originalPhrase.slice(0, i));
          await new Promise((resolve) => setTimeout(resolve, 25));
        }

        if (!active) return;
        setStatus("waitingToClick");
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // 3. Trigger Humanize click state
        if (!active) return;
        setStatus("loading");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // 4. Stream humanized text
        if (!active) return;
        setStatus("typingOutput");
        for (let i = 0; i <= humanizedPhrase.length; i++) {
          if (!active) return;
          setOutputText(humanizedPhrase.slice(0, i));
          await new Promise((resolve) => setTimeout(resolve, 30));
        }

        if (!active) return;
        setStatus("done");
        await new Promise((resolve) => setTimeout(resolve, 6000));
      }
    };

    runSequence();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full glass-card rounded-2xl overflow-hidden shadow-2xl border border-border flex flex-col h-auto min-h-[340px] md:h-[340px] text-left">
      {/* Header bar */}
      <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="h-2 w-2 rounded-full bg-red-500/80" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
          <span className="h-2 w-2 rounded-full bg-green-500/80" />
          <span className="ml-1 text-[10px] uppercase tracking-wider font-semibold">Simulator Panel</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[9px] uppercase tracking-wider font-mono">Natural Mode</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        {/* Input box mockup */}
        <div className="p-5 flex flex-col justify-between h-[150px] md:h-auto">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
              <FileText className="h-3.5 w-3.5" /> Original Text
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-mono min-h-[60px] max-h-[85px] overflow-hidden select-none">
              {inputText}
              {(status === "typingInput" || status === "waitingToClick") && <span className="animate-pulse">|</span>}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-[10px] text-muted-foreground">{inputText ? inputText.split(/\s+/).filter(Boolean).length : 0} words</span>
            <button
              disabled
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
                status === "waitingToClick"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.03]"
                  : status === "loading"
                  ? "bg-primary/50 text-primary-foreground cursor-not-allowed"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {status === "loading" ? (
                <>
                  <span className="h-2.5 w-2.5 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full" />
                  Humanizing
                </>
              ) : (
                <>
                  <Sparkles className="h-2.5 w-2.5" />
                  Humanize
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output box mockup */}
        <div className="p-5 flex flex-col justify-between h-[150px] md:h-auto bg-primary/[0.01]">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5" /> Humanized version
            </div>
            <div className="text-xs leading-relaxed font-medium min-h-[60px] max-h-[85px] overflow-hidden select-none">
              {status === "loading" && (
                <div className="space-y-2 pt-1 animate-pulse">
                  <div className="h-3 w-5/6 bg-muted rounded-md" />
                  <div className="h-3 w-3/5 bg-muted rounded-md" />
                </div>
              )}
              {outputText && (
                <span className="bg-primary/5 border-l-2 border-primary pl-2 py-1 inline-block text-foreground rounded-r">
                  {outputText}
                </span>
              )}
              {status === "typingOutput" && <span className="animate-pulse">|</span>}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border text-[10px] text-muted-foreground">
            <span>{outputText ? outputText.split(/\s+/).filter(Boolean).length : 0} words</span>
            {status === "done" && (
              <span className="text-[9px] text-green-500 font-semibold uppercase tracking-wider flex items-center gap-1 animate-fade-in-up">
                ✓ Bypassed AI
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
