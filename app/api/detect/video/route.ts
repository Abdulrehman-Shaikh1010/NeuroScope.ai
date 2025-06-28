import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const data = await req.formData()
  const file = data.get("file") as File

  if (!file) return NextResponse.json({ error: "No video file uploaded" }, { status: 400 })

  try {
    const result = "Human"
    const confidence = 75.6
    return NextResponse.json({ result, confidence })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Video detection failed" }, { status: 500 })
  }
}
