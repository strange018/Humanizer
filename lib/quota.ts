import { prisma } from "./prisma";

// ─── Constants ───────────────────────────────────────────────────────────────

/** Daily token limits */
export const QUOTA = {
  /** Logged-in users get a generous daily budget */
  AUTHENTICATED_DAILY_TOKENS: 15_000,
  /** Anonymous visitors get a small free tier */
  ANONYMOUS_DAILY_TOKENS: 3_000,
  /** Thresholds (fraction of total) at which we emit a warning */
  WARNING_THRESHOLDS: [0.5, 0.75, 1.0] as const,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Rough OpenAI token estimate: ~4 chars per token */
export function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(text.length / 4));
}

/** Returns next midnight UTC as the reset timestamp */
export function getNextResetAt(): Date {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d;
}

/** Format a Date as a human-readable local date+time string */
export function formatResetTime(date: Date): string {
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// ─── DB helpers (server-side, authenticated users only) ──────────────────────

export interface QuotaStatus {
  used: number;
  limit: number;
  remaining: number;
  percentage: number; // 0–100
  resetAt: Date;
  exhausted: boolean;
}

/**
 * Fetch (and auto-reset if expired) the quota record for a user.
 */
export async function getUserQuota(userId: string): Promise<QuotaStatus> {
  const now = new Date();
  const limit = QUOTA.AUTHENTICATED_DAILY_TOKENS;

  let row = await prisma.tokenUsage.findUnique({ where: { userId } });

  // Create or reset if past resetAt
  if (!row || row.resetAt <= now) {
    row = await prisma.tokenUsage.upsert({
      where: { userId },
      create: { userId, tokensUsed: 0, resetAt: getNextResetAt() },
      update: { tokensUsed: 0, resetAt: getNextResetAt() },
    });
  }

  const used = row.tokensUsed;
  const remaining = Math.max(0, limit - used);
  const percentage = Math.min(100, Math.round((used / limit) * 100));

  return {
    used,
    limit,
    remaining,
    percentage,
    resetAt: row.resetAt,
    exhausted: used >= limit,
  };
}

/**
 * Deduct `tokens` from the user's daily budget.
 * Resets the budget first if the resetAt window has passed.
 */
export async function consumeTokens(userId: string, tokens: number): Promise<QuotaStatus> {
  const now = new Date();

  // Check if an existing record needs a reset
  const existing = await prisma.tokenUsage.findUnique({ where: { userId } });
  if (existing && existing.resetAt <= now) {
    // Window expired – start fresh then add the new tokens
    await prisma.tokenUsage.update({
      where: { userId },
      data: { tokensUsed: tokens, resetAt: getNextResetAt() },
    });
  } else {
    await prisma.tokenUsage.upsert({
      where: { userId },
      create: { userId, tokensUsed: tokens, resetAt: getNextResetAt() },
      update: { tokensUsed: { increment: tokens } },
    });
  }

  return getUserQuota(userId);
}
