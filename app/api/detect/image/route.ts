import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get("file") as File

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })

  try {
    const bytes = await file.arrayBuffer()
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" })
    const result = await model.generateContent([
      "Tell if this image is AI-generated or human-made. Only say 'AI' or 'Human' with confidence from 0 to 100.",
      { inlineData: { data: Buffer.from(bytes).toString("base64"), mimeType: file.type } },
    ])
    const response = await result.response.text()
    const [resultType, confidenceStr] = response.split(/,|:/)
    return NextResponse.json({
      result: resultType?.trim(),
      confidence: parseFloat(confidenceStr) || 70,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Image detection failed" }, { status: 500 })
  }
}
