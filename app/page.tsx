import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, RefreshCw, Layers } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden min-h-screen flex flex-col justify-between glow-grid">
      {/* Background radial gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-600 to-fuchsia-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 flex-1 flex flex-col justify-center">
        {/* Ad slots outside active area */}
        <AdBanner className="mb-8" />

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6 animate-float">
            <Sparkles className="h-3 w-3" />
            100% Free AI Writing Assistant
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-foreground">
            Make Your AI Text Sound <br className="hidden sm:inline" />
            <span className="gradient-text">Completely Human</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Bypass AI detection and rewrite content to sound natural, polished, and authentic.
            Perfect for students, writers, and professionals who want natural writing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/editor"
              className="px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-all rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer scale-100 hover:scale-[1.02]"
            >
              Start Writing Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
            >
              Create Free Account <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mx-auto mt-20 max-w-5xl sm:mt-24 lg:mt-32">
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
        <AdBanner className="mt-12" />
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
