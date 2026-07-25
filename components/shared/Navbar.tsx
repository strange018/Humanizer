"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";
import { Sparkles, History, LayoutDashboard, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = status === "authenticated";

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-all glow">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="font-bold text-xl tracking-tight gradient-text">
                Humanize AI
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/editor"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Editor
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/history"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
                >
                  <History className="h-4 w-4" />
                  History
                </Link>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {status === "loading" ? (
              <div className="w-20 h-9 rounded-md bg-muted/40 animate-pulse" />
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border text-sm">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-5 w-5 rounded-full"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium truncate max-w-[120px]">
                    {session?.user?.name || session?.user?.email}
                  </span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg font-semibold shadow-sm shadow-primary/25 cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-muted"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-3 animate-fade-in-up">
          <Link
            href="/editor"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            Editor
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Dashboard
              </Link>
              <Link
                href="/history"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                History
              </Link>
            </>
          )}
          <hr className="border-border/60" />
          {isLoggedIn ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span className="font-medium truncate">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left py-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-md block cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 px-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2 text-base font-medium border rounded-md hover:bg-muted"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="text-center py-2 text-base font-medium text-primary-foreground bg-primary rounded-md shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
