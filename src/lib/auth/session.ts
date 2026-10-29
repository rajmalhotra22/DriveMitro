import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { User, UserRole } from "@/types";
import { dbStore } from "../db/store";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET must be configured in production.");
}

const sessionSecret = JWT_SECRET || "drivemitro-development-only-session-secret";
const encodedKey = new TextEncoder().encode(sessionSecret);
const COOKIE_NAME = "dm_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  driverId?: string;
}

export async function createSessionToken(user: User): Promise<string> {
  // If user is driver, attach their driver profile ID
  let driverId: string | undefined;
  if (user.role === "driver") {
    const driver = dbStore.getDriverById(user.id);
    driverId = driver?.id;
  }

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone,
    driverId,
  };

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireAuthUser(allowedRoles?: UserRole[]): Promise<{
  user: SessionPayload;
  error?: string;
}> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return { user };
}

export const SESSION_COOKIE_OPTIONS = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};
