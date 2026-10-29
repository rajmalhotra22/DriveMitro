import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function POST() {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    dbStore.resetData();

    return NextResponse.json({
      success: true,
      message: "Demo dataset reset successfully to initial state.",
    });
  } catch (err: unknown) {
    console.error("[Reset Demo Data Error]:", err);
    return NextResponse.json(
      { error: "Failed to reset demo data." },
      { status: 500 }
    );
  }
}
