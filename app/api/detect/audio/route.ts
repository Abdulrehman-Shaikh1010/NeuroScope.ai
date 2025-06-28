import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get("file") as File

  if (!file) return NextResponse.json({ error: "No audio file uploaded" }, { status: 400 })

  try {
    const result = "AI"
    const confidence = 87.2
    return NextResponse.json({ result, confidence })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Audio detection failed" }, { status: 500 })
  }
}
