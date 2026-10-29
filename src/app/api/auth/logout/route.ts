import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_OPTIONS.name, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });

  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
