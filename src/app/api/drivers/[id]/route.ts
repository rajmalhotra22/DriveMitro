import { NextResponse } from "next/server";
import { dbStore } from "@/lib/db/store";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const driver = dbStore.getDriverById(id);

    if (!driver) {
      return NextResponse.json(
        { error: "Driver not found." },
        { status: 404 }
      );
    }

    const reviews = dbStore.getReviews(driver.id);

    return NextResponse.json({
      success: true,
      driver,
      reviews,
    });
  } catch (err: unknown) {
    console.error("[Driver Detail API Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve driver profile." },
      { status: 500 }
    );
  }
}
