import { NextRequest, NextResponse } from "next/server";
import { calculateHumanScore } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const hfToken = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
    const hfModel = process.env.HF_MODEL || "openai-community/roberta-base-openai-detector";

    if (hfToken && hfToken.trim()) {
      // Perform Hugging Face Inference API Call
      try {
        const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hfToken.trim()}`,
          },
          body: JSON.stringify({ inputs: text }),
        });

        if (!response.ok) {
          throw new Error(`Hugging Face API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // Hugging Face text classification can return nested arrays:
        // e.g. [[{"label": "Real", "score": 0.98}, {"label": "Fake", "score": 0.02}]]
        // or a flat array: [{"label": "Real", "score": 0.98}]
        const results = Array.isArray(data[0]) ? data[0] : (Array.isArray(data) ? data : []);

        if (results.length > 0) {
          // Standard labels for openai-community/roberta-base-openai-detector are "Real" / "Fake" (or "real" / "fake" / "human" / "LABEL_0" etc.)
          const realItem = results.find((r: any) =>
            r.label && (r.label.toLowerCase() === "real" || r.label.toLowerCase() === "human" || r.label.toLowerCase() === "label_0")
          );
          const fakeItem = results.find((r: any) =>
            r.label && (r.label.toLowerCase() === "fake" || r.label.toLowerCase() === "label_1")
          );

          let humanScore = 50;
          if (realItem) {
            humanScore = Math.round(realItem.score * 100);
          } else if (fakeItem) {
            humanScore = Math.round((1 - fakeItem.score) * 100);
          } else {
            // Fallback to checking the first result's label
            const first = results[0];
            if (first.label && (first.label.toLowerCase().includes("real") || first.label.toLowerCase().includes("human"))) {
              humanScore = Math.round(first.score * 100);
            } else {
              humanScore = Math.round((1 - first.score) * 100);
            }
          }

          return NextResponse.json({ humanScore, source: `Hugging Face API (${hfModel})` });
        }
      } catch (err) {
        console.error("[HUGGING FACE API ERROR]", err);
        // Fallback to local heuristic if API fails during runtime (e.g. rate limit, network down)
      }
    }

    // --- Local Heuristic Fallback ---
    const humanScore = calculateHumanScore(text);
    return NextResponse.json({ humanScore, source: "Local Heuristic (Simulated)" });
  } catch (err) {
    console.error("[DETECTOR API]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
