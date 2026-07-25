"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await registerRes.json();

      if (!registerRes.ok) {
        throw new Error(data.error || "Failed to register user");
      }

      // Auto login after sign up
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push("/login?error=auto-login-failed");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 border border-border/80 bg-card rounded-2xl shadow-lg glow relative">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-2">
          <Sparkles className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
        <p className="text-sm text-muted-foreground mt-1">Get started with a free Humanize AI account</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 animate-fade-in-up">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-colors outline-none"
            placeholder="John Doe"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-colors outline-none"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-sm transition-colors outline-none"
            placeholder="Min. 8 characters"
            required
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/95 rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Already have an account?{" "}
        <a href="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
}
