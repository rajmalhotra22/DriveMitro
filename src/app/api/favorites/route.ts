import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";
import { dbStore } from "@/lib/db/store";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const favorites = dbStore.getFavorites(session.userId);
    const drivers = dbStore.getDrivers();
    const favoriteDrivers = favorites
      .map((f) => drivers.find((d) => d.id === f.driverId))
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      favorites: favoriteDrivers,
    });
  } catch (err: unknown) {
    console.error("[Favorites GET Error]:", err);
    return NextResponse.json(
      { error: "Failed to retrieve favorites." },
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

    const { driverId } = await request.json();
    if (!driverId) {
      return NextResponse.json(
        { error: "driverId is required." },
        { status: 400 }
      );
    }

    const isFav = dbStore.toggleFavorite(session.userId, driverId);

    return NextResponse.json({
      success: true,
      isFavorite: isFav,
      message: isFav
        ? "Driver added to your favorites."
        : "Driver removed from your favorites.",
    });
  } catch (err: unknown) {
    console.error("[Favorites POST Error]:", err);
    return NextResponse.json(
      { error: "Failed to toggle favorite." },
      { status: 500 }
    );
  }
}
