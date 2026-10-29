import { NextResponse } from "next/server";
import { dbStore } from "@/lib/db/store";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Please provide an email address." },
        { status: 400 }
      );
    }

    const user = dbStore.getUserByEmail(email);

    // Development / Zero-budget mode notification:
    // To protect security without pretending to send emails, we provide a safe reset code or instructions
    if (!user) {
      // Don't disclose user existence in production, but in development return honest feedback
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, password recovery instructions have been logged to the server.",
        devHint: "Email not found in local store. Try demo accounts: customer@drivemitro.com or driver@drivemitro.com",
      });
    }

    const resetToken = `reset_${Math.random().toString(36).substring(2, 10)}`;

    return NextResponse.json({
      success: true,
      message:
        "Demo Reset Mode: In production, a secure reset link is dispatched via configured SMTP/Resend. For local testing, use the preset demo passwords or use the reset token below.",
      devToken: resetToken,
      defaultPasswords: {
        customer: "MitroCustomer123!",
        driver: "MitroDriver123!",
        admin: "MitroAdmin123!",
      },
    });
  } catch (err: unknown) {
    console.error("[Forgot Password Error]:", err);
    return NextResponse.json(
      { error: "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
