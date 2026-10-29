import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function GET() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: Admin access required." },
      { status: 403 }
    );
  }

  const config = dbStore.getPricingConfig();
  return NextResponse.json({ success: true, config });
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = dbStore.updatePricingConfig(body, session.name);

    return NextResponse.json({
      success: true,
      message: "Platform pricing updated successfully.",
      config: updated,
    });
  } catch (err: unknown) {
    console.error("[Pricing Config Update Error]:", err);
    return NextResponse.json(
      { error: "Failed to update pricing configuration." },
      { status: 500 }
    );
  }
}
