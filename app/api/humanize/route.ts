import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { openai, MODEL, getSystemPrompt, type RewriteMode } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { countWords, countChars, generateTitle } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { text, mode = "natural", save = true } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (text.length > 50000) {
      return NextResponse.json({ error: "Text is too long. Maximum 50,000 characters." }, { status: 400 });
    }

    const validModes: RewriteMode[] = ["natural", "professional", "academic", "simple", "creative"];
    if (!validModes.includes(mode)) {
      return NextResponse.json({ error: "Invalid rewrite mode" }, { status: 400 });
    }

    const systemPrompt = getSystemPrompt(mode as RewriteMode);

    // Create a streaming response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Run AI and save in background
    (async () => {
      let fullText = "";
      try {
        const completion = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text },
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 4000,
        });

        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content || "";
          if (delta) {
            fullText += delta;
            await writer.write(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
          }
        }

        // Save to history if user is authenticated
        if (save && fullText) {
          const session = await auth();
          if (session?.user?.id) {
            await prisma.rewrite.create({
              data: {
                userId: session.user.id,
                originalText: text,
                rewrittenText: fullText,
                mode,
                wordCount: countWords(fullText),
                charCount: countChars(fullText),
                title: generateTitle(text),
              },
            });
          }
        }

        await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      } catch (err) {
        console.error("[HUMANIZE STREAM]", err);
        await writer.write(
          encoder.encode(`data: ${JSON.stringify({ error: "AI generation failed. Please try again." })}\n\n`)
        );
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[HUMANIZE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
