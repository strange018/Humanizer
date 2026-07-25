import { NextRequest, NextResponse } from "next/server";
import { calculateHumanScore } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GPTZERO_API_KEY;

    if (apiKey && apiKey.trim()) {
      // Perform real GPTZero API Call
      try {
        const response = await fetch("https://api.gptzero.me/v2/predict/text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-api-key": apiKey,
          },
          body: JSON.stringify({
            document: text,
            version: "latest",
          }),
        });

        if (!response.ok) {
          throw new Error(`GPTZero API responded with status ${response.status}`);
        }

        const data = await response.json();
        
        // v2 predict/text response structure extract probability
        const completelyGeneratedProb = data.completely_generated_prob !== undefined 
          ? data.completely_generated_prob 
          : (data.documents && data.documents[0]?.completely_generated_prob) !== undefined
            ? data.documents[0].completely_generated_prob
            : 0.5;

        const humanScore = Math.round((1 - completelyGeneratedProb) * 100);
        return NextResponse.json({ humanScore, source: "GPTZero API" });
      } catch (err) {
        console.error("[GPTZERO API ERROR]", err);
        // Fallback to local heuristic if API fails during runtime (e.g. quota limit, network down)
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
