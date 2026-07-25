import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Check } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { InteractiveDemo } from "@/components/shared/InteractiveDemo";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden min-h-screen flex flex-col justify-between glow-grid">
      {/* Ambient moving background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full filter blur-[100px] animate-blob -z-10 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full filter blur-[120px] animate-blob animation-delay-2000 -z-10 pointer-events-none" />

      {/* Main Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-16 flex-1 flex flex-col justify-center w-full">
        {/* Upper Banner Ads slot */}
        <AdBanner className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, description and trust signals */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary animate-float">
              <Sparkles className="h-3 w-3" />
              100% Free AI Writing Assistant
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground leading-[1.1] sm:leading-[1.1]">
              Make Your AI Text Sound <br />
              <span className="gradient-text">Completely Human</span>
            </h1>

            <p className="text-lg leading-relaxed text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Bypass AI detection and rewrite content to sound natural, polished, and authentic. 
              Perfect for students, copywriters, and professionals who want human-like writing.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/editor"
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/95 transition-all rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-95"
              >
                Start Writing Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto text-sm font-semibold px-6 py-3 border border-border text-foreground hover:bg-muted/50 transition-colors rounded-xl flex items-center justify-center gap-1.5"
              >
                Create Free Account
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-border/60">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Built to Bypass Leading Detectors
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted border border-border/80">
                  <Check className="h-3.5 w-3.5 text-green-500" /> Turnitin Proof
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted border border-border/80">
                  <Check className="h-3.5 w-3.5 text-green-500" /> GPTZero proof
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-muted border border-border/80">
                  <Check className="h-3.5 w-3.5 text-green-500" /> Copyleaks Proof
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Simulator Widget */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <InteractiveDemo />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-24 max-w-5xl sm:mt-28 lg:mt-36">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Professional Grade AI Humanizer
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Powerful rewriting engines customized for every type of context and format.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative flex flex-col p-6 rounded-2xl glass-card glass-card-hover glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Fast Streaming Rewrites</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Generate naturally flowing text sentence-by-sentence in seconds using advanced language models.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative flex flex-col p-6 rounded-2xl glass-card glass-card-hover glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">5 Writing Modes</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Choose between Natural, Professional, Academic, Simple English, and Creative styles depending on your audience.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative flex flex-col p-6 rounded-2xl glass-card glass-card-hover glow">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">AI Bypass Guaranteed</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Produces natural content designed to bypass AI detectors like Turnitin, GPTZero, and Copyleaks.
              </p>
            </div>
          </div>
        </div>

        {/* Lower Banner Ads slot */}
        <AdBanner className="mt-16" />
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/40 py-6 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Humanize AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
