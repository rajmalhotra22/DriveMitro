import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session || (session.role !== "driver" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { isAvailable, serviceAreas, vehiclePreferences, bio } = await request.json();
    const driver = dbStore.getDriverById(session.userId);

    if (!driver) {
      return NextResponse.json(
        { error: "Driver profile not found." },
        { status: 404 }
      );
    }

    // Unverified drivers cannot toggle available
    if (isAvailable && driver.verificationStatus !== "approved") {
      return NextResponse.json(
        {
          error:
            "Cannot go online: Your profile verification is not approved yet.",
        },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (typeof isAvailable === "boolean") updates.isAvailable = isAvailable;
    if (serviceAreas) updates.serviceAreas = serviceAreas;
    if (vehiclePreferences) updates.vehiclePreferences = vehiclePreferences;
    if (bio) updates.bio = bio;

    const updated = dbStore.updateDriverProfile(driver.id, updates);

    return NextResponse.json({
      success: true,
      message: "Driver status updated successfully.",
      driver: updated,
    });
  } catch (err: unknown) {
    console.error("[Driver Status Update Error]:", err);
    return NextResponse.json(
      { error: "Failed to update driver status." },
      { status: 500 }
    );
  }
}
