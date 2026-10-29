import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";
import { VerificationStatus } from "@/types";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin access required." },
        { status: 403 }
      );
    }

    const { status, adminNotes } = await request.json();
    if (!status) {
      return NextResponse.json(
        { error: "Verification status is required." },
        { status: 400 }
      );
    }

    const validStatuses: VerificationStatus[] = [
      "not_submitted",
      "pending",
      "approved",
      "rejected",
      "resubmission_required",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    const updatedRec = dbStore.updateVerificationStatus(
      id,
      status,
      adminNotes,
      session.userId
    );

    // Audit log
    dbStore.createAuditLog({
      id: `aud_${Date.now()}`,
      action: `DRIVER_VERIFICATION_${status.toUpperCase()}`,
      performedBy: session.name,
      role: "admin",
      targetType: "DriverProfile",
      targetId: id,
      details: adminNotes || `Driver verification updated to ${status}`,
      timestamp: new Date().toISOString(),
    });

    // Notify driver
    const driver = dbStore.getDriverById(id);
    if (driver) {
      dbStore.createNotification({
        id: `notif_${Date.now()}_verif_update`,
        userId: driver.userId,
        title: `Verification Status: ${status.replace("_", " ").toUpperCase()}`,
        message:
          status === "approved"
            ? "Congratulations! Your driver documents have been approved. You are now verified and can receive booking requests."
            : `Your verification status has been updated to: ${status}. Admin notes: ${adminNotes || "None"}`,
        type: "verification",
        read: false,
        linkUrl: "/driver/verification",
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: `Driver verification status updated to ${status}.`,
      record: updatedRec,
    });
  } catch (err: unknown) {
    console.error("[Driver Verification Update Error]:", err);
    return NextResponse.json(
      { error: "Failed to update verification status." },
      { status: 500 }
    );
  }
}
