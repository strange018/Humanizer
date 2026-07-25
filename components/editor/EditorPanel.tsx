"use client";

import { useState, useEffect } from "react";
import { ModeSelector } from "./ModeSelector";
import { FileUpload } from "./FileUpload";
import { countWords, countChars, downloadTextFile } from "@/lib/utils";
import { type RewriteMode } from "@/lib/openai";
import { Sparkles, Copy, Download, RotateCcw, Columns, FileText, Check, AlertCircle, X } from "lucide-react";
import { useSession } from "next-auth/react";

export function EditorPanel() {
  const { status } = useSession();
  const [inputText, setInputText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [mode, setMode] = useState<RewriteMode>("natural");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Monetization and upgrade states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [adCountdown, setAdCountdown] = useState(5);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [isAdCompleted, setIsAdCompleted] = useState(false);
  const [rewardedWords, setRewardedWords] = useState(0);

  // Paragraph selection for targeted rewrites
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);

  // Update paragraphs list when input text changes
  useEffect(() => {
    const pList = inputText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    setParagraphs(pList);
  }, [inputText]);

  // Ad countdown effect
  useEffect(() => {
    let timer: any;
    if (showAdModal && isAdPlaying && adCountdown > 0) {
      timer = setInterval(() => {
        setAdCountdown((prev) => prev - 1);
      }, 1000);
    } else if (adCountdown === 0 && isAdPlaying) {
      setIsAdPlaying(false);
      setIsAdCompleted(true);
      setRewardedWords((prev) => prev + 1000);
    }
    return () => clearInterval(timer);
  }, [showAdModal, isAdPlaying, adCountdown]);

  const handleRewrite = async (targetText?: string, paragraphIndex: number | null = null) => {
    const textToProcess = targetText || inputText;
    if (!textToProcess.trim()) return;

    setIsLoading(true);
    setError(null);
    if (paragraphIndex === null) {
      setRewrittenText("");
    }

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToProcess,
          mode,
          // Only save to DB history if they are logged in AND it's a full document rewrite
          save: status === "authenticated" && paragraphIndex === null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process text");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let finishedText = "";

      if (!reader) {
        throw new Error("Failed to initialize stream reader");
      }

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.content) {
                finishedText += parsed.content;
                if (paragraphIndex !== null) {
                  // targeted paragraph replacement
                  setRewrittenText((prev) => {
                    const currentParts = prev ? prev.split(/\n\s*\n/) : [];
                    currentParts[paragraphIndex] = finishedText;
                    return currentParts.join("\n\n");
                  });
                } else {
                  setRewrittenText((prev) => prev + parsed.content);
                }
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              // Ignore partial JSON parse errors from streaming split boundary cuts
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during rewrite.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!rewrittenText) return;
    navigator.clipboard.writeText(rewrittenText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!rewrittenText) return;
    downloadTextFile(rewrittenText, `humanized-${mode}.txt`);
  };

  const handleParagraphRewrite = (index: number) => {
    setSelectedParagraphIndex(index);
    handleRewrite(paragraphs[index], index);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Mode Selector and File Upload Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <ModeSelector activeMode={mode} onChange={setMode} disabled={isLoading} />
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
              compareMode
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-card text-muted-foreground hover:text-foreground border-border"
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            {compareMode ? "Side-by-Side: On" : "Side-by-Side: Off"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="flex flex-col h-[500px] glass-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:border-primary/25 transition-all duration-300">
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Original Text
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-2">
              {rewardedWords > 0 && (
                <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded text-[10px] animate-pulse">
                  🎁 {rewardedWords} bonus words
                </span>
              )}
              <span>
                {countWords(inputText)} words | {countChars(inputText)} chars
              </span>
            </span>
          </div>

          <div className="flex-1 relative flex flex-col p-4">
            {inputText.trim() === "" && (
              <div className="absolute inset-x-4 top-4 z-10">
                <FileUpload onTextExtracted={setInputText} disabled={isLoading} />
              </div>
            )}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your text here to humanize, or drag & drop a .txt, .docx, or .pdf file above..."
              className="flex-1 w-full bg-transparent resize-none border-none outline-none text-foreground placeholder:text-muted-foreground/60 text-sm leading-relaxed focus:ring-0 focus:outline-none focus:border-none p-1"
              disabled={isLoading}
            />
          </div>

          {inputText && (
            <div className="px-4 py-3 border-t bg-muted/20 flex justify-between items-center">
              <button
                onClick={() => setInputText("")}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                disabled={isLoading}
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
              <button
                onClick={() => handleRewrite()}
                disabled={isLoading || !inputText.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 disabled:bg-primary/50 text-primary-foreground font-semibold text-xs rounded-lg shadow-sm shadow-primary/20 cursor-pointer disabled:cursor-not-allowed transition-all scale-100 hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 border-2 border-primary-foreground border-t-transparent animate-spin rounded-full inline-block" />
                    Humanizing...
                  </span>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Humanize Text
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Output Panel / Side-by-Side comparison */}
        <div className="flex flex-col h-[500px] glass-card rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:border-primary/25 transition-all duration-300 relative">
          <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/40">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Humanized Version
            </span>
            <span className="text-xs text-muted-foreground">
              {countWords(rewrittenText)} words | {countChars(rewrittenText)} chars
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading && !rewrittenText && (
              <div className="space-y-3 py-4">
                <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
                <div className="h-4 bg-muted animate-pulse rounded-md w-5/6" />
                <div className="h-4 bg-muted animate-pulse rounded-md w-2/3" />
              </div>
            )}

            {!isLoading && !rewrittenText && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center px-6">
                <Sparkles className="h-8 w-8 mb-2 opacity-40 text-primary animate-float" />
                <p className="text-sm font-medium">Your natural, fluent content will appear here.</p>
                <p className="text-xs opacity-75 mt-1">Select a writing mode above and click "Humanize Text".</p>
              </div>
            )}

            {compareMode && rewrittenText ? (
              // Side by side Comparison view
              <div className="grid grid-cols-2 gap-4 h-full">
                <div className="border-r pr-4 space-y-4 overflow-y-auto max-h-[420px] text-sm text-muted-foreground leading-relaxed">
                  {paragraphs.map((p, i) => (
                    <div
                      key={i}
                      onClick={() => handleParagraphRewrite(i)}
                      className="p-2.5 rounded-lg hover:bg-muted/60 hover:text-foreground cursor-pointer transition-colors border border-transparent hover:border-border group relative"
                    >
                      <span className="absolute -left-1 top-2.5 text-[8px] bg-primary/15 text-primary rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Rewrite
                      </span>
                      {p}
                    </div>
                  ))}
                </div>
                <div className="pl-2 space-y-4 overflow-y-auto max-h-[420px] text-sm text-foreground leading-relaxed">
                  {rewrittenText.split(/\n\s*\n/).map((p, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Standard text display with streaming cursor Support
              rewrittenText && (
                <div
                  className={`text-sm leading-relaxed whitespace-pre-wrap ${
                    isLoading ? "cursor-blink" : ""
                  }`}
                >
                  {rewrittenText}
                </div>
              )
            )}

            {/* Monetization / Sponsorship banner */}
            {!isLoading && rewrittenText && (
              <div className="p-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-violet-500/5 to-primary/5 space-y-3 animate-fade-in-up mt-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                      Rewrite Complete! Choose Pro or Watch Sponsor Ad
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      You are using the free humanizer tier. Go premium for unlimited words, or watch a sponsor video ad to get 1,000 words.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-primary hover:bg-primary/95 text-primary-foreground rounded-lg shadow-sm cursor-pointer transition-all flex items-center gap-1 hover:scale-[1.02]"
                  >
                    🚀 Go Premium
                  </button>
                  <button
                    onClick={() => {
                      setAdCountdown(5);
                      setIsAdPlaying(true);
                      setIsAdCompleted(false);
                      setShowAdModal(true);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground rounded-lg border border-border cursor-pointer transition-all flex items-center gap-1 hover:scale-[1.02]"
                  >
                    📺 Watch Sponsor Ad
                  </button>
                </div>
              </div>
            )}
          </div>

          {rewrittenText && (
            <div className="px-4 py-3 border-t bg-muted/20 flex justify-between items-center">
              <button
                onClick={() => {
                  setRewrittenText("");
                  setSelectedParagraphIndex(null);
                }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                disabled={isLoading}
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all border cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Copy Text"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all border cursor-pointer flex items-center gap-1 text-xs font-semibold"
                  title="Download File"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 animate-fade-in-up">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl p-6 relative overflow-hidden animate-scale-in">
            <div className="absolute top-0 right-0 p-4">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="text-center space-y-2 mb-6">
              <div className="inline-block p-3 bg-primary/10 text-primary rounded-2xl mb-2 text-xl">
                🚀
              </div>
              <h3 className="text-xl font-bold text-foreground">Upgrade to Humanize AI Pro</h3>
              <p className="text-xs text-muted-foreground">
                Get the ultimate writing assistant with zero limitations and maximum performance.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-foreground">Unlimited Word Counts</h4>
                  <p className="text-xs text-muted-foreground">Bypass the 50,000 character limit entirely.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-foreground">5x Faster Response Times</h4>
                  <p className="text-xs text-muted-foreground">Dedicated premium API priority routing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-foreground">Advanced Rewrite Engine</h4>
                  <p className="text-xs text-muted-foreground">Specialized modes to bypass Turnitin & GPTZero.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-sm">
                <span className="text-green-500 font-bold mt-0.5">✓</span>
                <div>
                  <h4 className="font-semibold text-foreground">100% Ad-Free Experience</h4>
                  <p className="text-xs text-muted-foreground">Remove all sponsors and sidebar elements.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-xl text-center space-y-1 mb-6">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Premium Access</span>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-extrabold text-foreground">$9.99</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                alert("Thank you! Pro features have been unlocked for this demo session.");
                setShowUpgradeModal(false);
              }}
              className="w-full py-3 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all hover:scale-[1.01]"
            >
              Get Pro Now
            </button>
          </div>
        </div>
      )}

      {/* Rewarded Video Ad Modal */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden relative flex flex-col aspect-video animate-scale-in">
            {/* Header / Info bar */}
            <div className="bg-black/50 border-b border-neutral-800 px-4 py-3 flex items-center justify-between text-neutral-200">
              <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-neutral-400">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Sponsor Video Ad
              </span>
              <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded font-mono">
                {isAdPlaying ? `Reward in: ${adCountdown}s` : "Finished"}
              </span>
            </div>

            {/* Video Player Area */}
            <div className="flex-1 relative bg-black flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              {isAdPlaying ? (
                <div className="space-y-6 max-w-md">
                  {/* Mock Video Ad Content */}
                  <div className="h-16 w-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-violet-500/20 animate-bounce">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white font-bold text-base">WriteBetter AI</h4>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Draft high-quality emails, essays, and articles in seconds with the world's smartest AI editor. Instantly format, check for plagiarism, and rewrite tone.
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2.5 w-full">
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-linear"
                        style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                      Please do not close this window to claim your reward
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 max-w-sm animate-fade-in-up">
                  <div className="h-14 w-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                    <Check className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-white font-bold text-base">1,000 Premium Words Unlocked!</h4>
                    <p className="text-neutral-400 text-xs">
                      Thank you for supporting Humanize AI. Your account has been credited with 1,000 bonus words for this session.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAdModal(false)}
                    className="px-5 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-green-600/15"
                  >
                    Collect & Close
                  </button>
                </div>
              )}
            </div>
            
            {/* Close button - only active after ad finishes */}
            {!isAdPlaying && (
              <button
                onClick={() => setShowAdModal(false)}
                className="absolute top-3 right-3 text-neutral-400 hover:text-white cursor-pointer bg-black/40 p-1.5 rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
