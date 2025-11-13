import { type NextRequest, NextResponse } from "next/server"
import { validateSession } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("session")?.value
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await validateSession(sessionId)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const files = await query<any[]>(
      "SELECT id, filename, original_filename, file_size, mime_type, cdn_url, upload_date, downloads FROM files WHERE user_id = ? ORDER BY upload_date DESC",
      [user.id],
    )

    return NextResponse.json({ files })
  } catch (error) {
    console.error("Files fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
