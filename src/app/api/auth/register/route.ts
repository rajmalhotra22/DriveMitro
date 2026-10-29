import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbStore } from "@/lib/db/store";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, SESSION_COOKIE_OPTIONS } from "@/lib/auth/session";
import { DriverProfile, User } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = "customer", driverDetails } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existingUser = dbStore.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = `user_${Date.now()}`;

    const newUser: User = {
      id: userId,
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: role === "driver" ? "driver" : "customer",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dbStore.createUser(newUser);

    // If driver registration, create initial unapproved profile & verification record
    if (role === "driver") {
      const driverId = `drv_${Date.now()}`;
      const newDriver: DriverProfile = {
        id: driverId,
        userId: userId,
        displayName: name,
        phone,
        bio: driverDetails?.bio || "New driver on DriveMitro platform.",
        yearsExperience: Number(driverDetails?.yearsExperience) || 1,
        city: "Patna",
        serviceAreas: driverDetails?.serviceAreas?.length
          ? driverDetails.serviceAreas
          : ["Boring Road", "Bailey Road"],
        languages: driverDetails?.languages?.length
          ? driverDetails.languages
          : ["Hindi"],
        vehiclePreferences: driverDetails?.vehiclePreferences?.length
          ? driverDetails.vehiclePreferences
          : ["Manual", "Hatchback"],
        skills: driverDetails?.skills || ["City Driving"],
        baseRateHourly: 149,
        baseRateFullDay: 999,
        rating: 0,
        reviewCount: 0,
        isAvailable: false, // Cannot be available until verified
        verificationStatus: "pending",
        badge: "Verification Pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dbStore.createDriverProfile(newDriver);

      dbStore.createVerificationRecord({
        id: `verif_${Date.now()}`,
        driverId: driverId,
        licenseNumber: driverDetails?.licenseNumber || "PENDING-SUBMISSION",
        licenseExpiry: driverDetails?.licenseExpiry || "2030-01-01",
        idProofType: "Aadhaar + Driving License",
        status: "pending",
        adminNotes: "New registration awaiting RTO & physical document check.",
        submittedAt: new Date().toISOString(),
      });
    }

    // Set auth cookie
    const token = await createSessionToken(newUser);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_OPTIONS.name, token, SESSION_COOKIE_OPTIONS);

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
      },
    });
  } catch (err: unknown) {
    console.error("[Register Error]:", err);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
