import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-client-compilation",
  baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
  dangerouslyAllowBrowser: true,
});

export const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

export type RewriteMode = "natural" | "professional" | "academic" | "simple" | "creative";

export const REWRITE_MODES: Record<RewriteMode, { label: string; description: string; emoji: string }> = {
  natural: {
    label: "Natural",
    description: "Conversational and easy to read",
    emoji: "🌿",
  },
  professional: {
    label: "Professional",
    description: "Formal and business-ready",
    emoji: "💼",
  },
  academic: {
    label: "Academic",
    description: "Scholarly with proper structure",
    emoji: "🎓",
  },
  simple: {
    label: "Simple English",
    description: "Clear and easy for everyone",
    emoji: "✨",
  },
  creative: {
    label: "Creative",
    description: "Expressive and engaging",
    emoji: "🎨",
  },
};

export function getSystemPrompt(mode: RewriteMode): string {
  const prompts: Record<RewriteMode, string> = {
    natural: `You are an expert editor. Rewrite the provided text to sound completely natural, human, and conversational. Intentionally vary your sentence lengths (use a mix of very short and long sentences). Use natural transitions, occasional idioms, and a warm tone. Avoid typical AI patterns like 'In conclusion,' 'Furthermore,' 'It is important to remember,' or overly perfect structures. Ensure the core message remains unchanged, but the flow feels organic.

Rules:
- Do NOT add new information or opinions
- Return ONLY the rewritten text, nothing else`,

    professional: `You are an expert business writing assistant. Rewrite the given text in a polished, professional tone suitable for business communications, reports, and formal documents.

Rules:
- Preserve ALL original meaning and key information
- Use formal but accessible language
- Maintain a confident, authoritative tone
- Avoid slang or overly casual language
- Use active voice where appropriate
- Ensure clarity and precision
- Return ONLY the rewritten text, nothing else`,

    academic: `You are an expert academic writing assistant. Rewrite the given text in a scholarly, academic style suitable for research papers, essays, and academic publications.

Rules:
- Preserve ALL original meaning and key information
- Use precise, technical language appropriate to the subject
- Maintain an objective, third-person perspective where suitable
- Use formal vocabulary and complex sentence structures
- Avoid contractions and colloquialisms
- Ensure logical flow and coherence
- Return ONLY the rewritten text, nothing else`,

    simple: `You are an expert at making complex text easy to understand. Rewrite the given text using Simple English — clear, short sentences and common words that anyone can understand.

Rules:
- Preserve ALL original meaning and key information
- Use short sentences (ideally under 20 words each)
- Use simple, everyday words (avoid jargon)
- Break complex ideas into smaller steps
- Use active voice
- Aim for a reading level of Grade 6-8
- Return ONLY the rewritten text, nothing else`,

    creative: `You are a creative writing expert. Rewrite the given text in an expressive, engaging, and creative style that captivates the reader.

Rules:
- Preserve ALL original meaning and key information
- Use vivid language, metaphors, and descriptive phrases
- Create rhythm and flow in the writing
- Make it engaging and memorable
- Balance creativity with clarity
- Avoid purple prose — keep it readable
- Return ONLY the rewritten text, nothing else`,
  };

  return prompts[mode];
}
