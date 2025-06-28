import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: NextRequest) {
  const { content } = await req.json()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(
      `Is this text written by a human or AI? Just reply with "Human" or "AI" and a confidence score from 0 to 100.\n\nText:\n${content}`
    )
    const response = await result.response.text()
    const [resultType, confidenceStr] = response.split(/,|:/)
    return NextResponse.json({
      result: resultType?.trim(),
      confidence: parseFloat(confidenceStr) || 70,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Text detection failed" }, { status: 500 })
  }
}


// import { NextRequest, NextResponse } from "next/server"
// import { GoogleGenerativeAI } from "@google/generative-ai"

// const GenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// export async function POST(req: NextRequest) {
//   try {
//     const { content } = await req.json()

//     if (!content) {
//       return NextResponse.json({ error: "No content provided" }, { status: 400 })
//     }

//     // Placeholder AI detection logic (replace with Gemini call later)
//     const result = "Human" // or "AI"
//     const confidence = 78.25

//     return NextResponse.json({ result, confidence })
//   } catch (err) {
//     console.error("❌ Text Detection Error:", err)
//     return NextResponse.json({ error: "Server Error" }, { status: 500 })
//   }
// }
