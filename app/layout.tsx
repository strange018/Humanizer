import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { Navbar } from "@/components/shared/Navbar";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Humanize AI - Free Natural Writing Assistant",
  description: "Rewrite AI-generated text to sound completely natural, fluent, and human-like. High performance, side-by-side comparison, supporting multiple writing styles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3233300830061516"
        crossOrigin="anonymous"
      />
      {process.env.NEXT_PUBLIC_GAM_REWARDED_SLOT_ID && (
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
