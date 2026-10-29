import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing/calculator";
import { dbStore } from "@/lib/db/store";
import { TripType } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tripType, durationHours, pickupTime, outstationDays } = body;

    if (!tripType) {
      return NextResponse.json(
        { error: "tripType is required." },
        { status: 400 }
      );
    }

    const config = dbStore.getPricingConfig();
    const breakdown = calculatePrice({
      tripType: tripType as TripType,
      durationHours: Number(durationHours) || 2,
      pickupTime,
      outstationDays: Number(outstationDays) || 1,
      config,
    });

    return NextResponse.json({
      success: true,
      pricing: breakdown,
      config,
    });
  } catch (err: unknown) {
    console.error("[Pricing API Error]:", err);
    return NextResponse.json(
      { error: "Failed to calculate pricing." },
      { status: 500 }
    );
  }
}
