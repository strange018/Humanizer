import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    let extractedText = "";

    if (fileName.endsWith(".txt")) {
      extractedText = await file.text();
    } else if (fileName.endsWith(".docx")) {
      const buffer = await file.arrayBuffer();
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      extractedText = result.value;
    } else if (fileName.endsWith(".pdf")) {
      const buffer = await file.arrayBuffer();
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: Buffer.from(buffer) });
      const result = await parser.getText();
      extractedText = result.text;
      await parser.destroy();
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload .txt, .docx, or .pdf files." },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: "Could not extract text from the file" }, { status: 400 });
    }

    return NextResponse.json({ text: extractedText.trim(), filename: file.name });
  } catch (err) {
    console.error("[UPLOAD]", err);
    return NextResponse.json({ error: "Failed to parse file" }, { status: 500 });
  }
}
