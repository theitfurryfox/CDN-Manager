import { NextResponse } from "next/server"
import { getBrandConfig } from "@/lib/brand"

export async function GET() {
  try {
    const brand = getBrandConfig()
    return NextResponse.json(brand)
  } catch (error) {
    console.error("Brand config error:", error)
    return NextResponse.json({ error: "Failed to load brand configuration" }, { status: 500 })
  }
}
