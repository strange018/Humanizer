import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function countWords(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function countChars(text: string): number {
  return text ? text.length : 0;
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function downloadTextFile(text: string, filename: string = "rewritten.txt") {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateTitle(text: string): string {
  const firstSentence = text.split(/[.!?]/)[0]?.trim() || text;
  return truncateText(firstSentence, 60);
}

export function calculateHumanScore(text: string): number {
  if (!text || !text.trim()) return 100;
  const lowerText = text.toLowerCase();
  
  // 1. AI Signature words/phrases
  const aiPhrases = [
    "in conclusion",
    "furthermore",
    "moreover",
    "it is important to note",
    "it is crucial to",
    "testament to",
    "delve",
    "tapestry",
    "not only",
    "pivotal role",
    "beacon",
    "a new era",
    "more than just",
    "please note that",
    "demystify"
  ];

  let deduction = 0;
  for (const phrase of aiPhrases) {
    let pos = lowerText.indexOf(phrase);
    while (pos !== -1) {
      deduction += 10;
      pos = lowerText.indexOf(phrase, pos + phrase.length);
    }
  }

  // 2. Sentence Length Variance (Burstiness)
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((len) => len > 0);

  let varianceDeduction = 0;
  if (sentences.length >= 3) {
    const avgLength = sentences.reduce((sum, len) => sum + len, 0) / sentences.length;
    const variance = sentences.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentences.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev < 3.5) {
      varianceDeduction = 25;
    } else if (stdDev < 5.0) {
      varianceDeduction = 12;
    }
  }

  let humanScore = 95 - deduction - varianceDeduction;

  // Pseudo-random fluctuation based on text content hash
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const pseudoRandom = Math.abs(Math.sin(hash));
  const fluctuation = Math.round((pseudoRandom - 0.5) * 6);
  humanScore += fluctuation;

  return Math.max(12, Math.min(99, humanScore));
}
