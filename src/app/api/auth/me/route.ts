import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = dbStore.getUserById(session.userId);
  if (!user) {
    return NextResponse.json({ user: null });
  }

  let driverProfile = null;
  if (user.role === "driver") {
    driverProfile = dbStore.getDriverById(user.id);
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      driverProfile,
    },
  });
}
