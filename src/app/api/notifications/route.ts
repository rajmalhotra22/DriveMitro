import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = dbStore.getNotifications(session.userId);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (err: unknown) {
    console.error("[Notifications GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve notifications." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, id } = body;

    if (action === "mark_all_read") {
      dbStore.markAllNotificationsRead(session.userId);
      return NextResponse.json({ success: true });
    }

    if (id) {
      dbStore.markNotificationRead(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err: unknown) {
    console.error("[Notifications POST Error]:", err);
    return NextResponse.json(
      { error: "Failed to update notification." },
      { status: 500 }
    );
  }
}
