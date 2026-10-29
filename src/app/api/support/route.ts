import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";
import { SupportTicket } from "@/types";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tickets =
      session.role === "admin"
        ? dbStore.getSupportTickets()
        : dbStore.getSupportTickets(session.userId);

    return NextResponse.json({
      success: true,
      tickets,
    });
  } catch (err: unknown) {
    console.error("[Support GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve support tickets." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    const body = await request.json();
    const { action, id, subject, category = "booking", priority = "medium", message, bookingRef, resolutionNotes, status } = body;

    if (action === "update" && id) {
      if (!session || session.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admin only." }, { status: 403 });
      }

      const updated = dbStore.updateSupportTicket(id, {
        status,
        resolutionNotes,
      });

      return NextResponse.json({
        success: true,
        ticket: updated,
      });
    }

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const userId = session ? session.userId : "guest_user";
    const userName = session ? session.name : body.name || "Guest Customer";
    const userPhone = session ? session.phone : body.phone || "Not provided";

    const ticketId = `TKT-PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketId,
      userId,
      userName,
      userPhone,
      bookingRef,
      subject,
      category,
      priority,
      status: "open",
      message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.createSupportTicket(newTicket);

    return NextResponse.json({
      success: true,
      message: "Support request received. Reference: " + ticketId,
      ticket: newTicket,
    });
  } catch (err: unknown) {
    console.error("[Support POST Error]:", err);
    return NextResponse.json(
      { error: "Failed to create support ticket." },
      { status: 500 }
    );
  }
}
