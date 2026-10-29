import { connection, NextResponse } from "next/server";
import { dbStore } from "@/lib/db/store";

export async function GET(request: Request) {
  await connection();

  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const vehicle = searchParams.get("vehicle");
    const minRating = parseFloat(searchParams.get("minRating") || "0");
    const minExperience = parseInt(searchParams.get("minExperience") || "0", 10);
    const search = searchParams.get("search")?.toLowerCase();
    const sort = searchParams.get("sort") || "recommended";
    const includeUnverified = searchParams.get("all") === "true";

    let drivers = dbStore.getDrivers();

    if (!includeUnverified) {
      drivers = drivers.filter((d) => d.verificationStatus === "approved");
    }

    if (area && area !== "all") {
      drivers = drivers.filter((d) =>
        d.serviceAreas.some((a) => a.toLowerCase().includes(area.toLowerCase()))
      );
    }

    if (vehicle && vehicle !== "all") {
      drivers = drivers.filter((d) =>
        d.vehiclePreferences.some((v) =>
          v.toLowerCase().includes(vehicle.toLowerCase())
        )
      );
    }

    if (minRating > 0) {
      drivers = drivers.filter((d) => d.rating >= minRating);
    }

    if (minExperience > 0) {
      drivers = drivers.filter((d) => d.yearsExperience >= minExperience);
    }

    if (search) {
      drivers = drivers.filter(
        (d) =>
          d.displayName.toLowerCase().includes(search) ||
          d.bio.toLowerCase().includes(search) ||
          d.skills.some((s) => s.toLowerCase().includes(search)) ||
          d.serviceAreas.some((a) => a.toLowerCase().includes(search))
      );
    }

    // Sorting
    if (sort === "rating") {
      drivers.sort((a, b) => b.rating - a.rating);
    } else if (sort === "experience") {
      drivers.sort((a, b) => b.yearsExperience - a.yearsExperience);
    } else if (sort === "price_low") {
      drivers.sort((a, b) => a.baseRateHourly - b.baseRateHourly);
    } else {
      drivers.sort((a, b) => {
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        return b.rating - a.rating;
      });
    }

    return NextResponse.json({
      success: true,
      count: drivers.length,
      drivers,
    });
  } catch (err: unknown) {
    console.error("[Drivers API Error]:", err);
    return NextResponse.json(
      { error: "Failed to fetch drivers." },
      { status: 500 }
    );
  }
}
