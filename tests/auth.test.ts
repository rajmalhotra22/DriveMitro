import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";
import { SEED_USERS } from "@/lib/db/seedData";
import { User } from "@/types";

describe("Authentication & Session Security", () => {
  it("should securely hash passwords and verify matches", async () => {
    const rawPassword = "PatnaSecureDriver99!";
    const hash = await hashPassword(rawPassword);

    expect(hash).not.toBe(rawPassword);
    expect(hash).toMatch(/^\$2[aby]\$/); // Standard bcrypt prefix

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isMismatch = await verifyPassword("WrongPassword123", hash);
    expect(isMismatch).toBe(false);
  });

  it("should create and verify valid JWT session tokens with role payload", async () => {
    const mockUser: User = {
      id: "user_test_99",
      name: "Suresh Yadav",
      email: "suresh@example.com",
      phone: "9835099999",
      role: "driver",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = await createSessionToken(mockUser);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(20);

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(mockUser.id);
    expect(decoded?.email).toBe(mockUser.email);
    expect(decoded?.role).toBe("driver");
  });

  it("only accepts each seeded account's own demo password", async () => {
    const credentials = [
      ["admin@drivemitro.com", "MitroAdmin123!"],
      ["customer@drivemitro.com", "MitroCustomer123!"],
      ["driver@drivemitro.com", "MitroDriver123!"],
    ];

    for (const [email, password] of credentials) {
      const user = SEED_USERS.find((seedUser) => seedUser.email === email);
      expect(user).toBeDefined();
      expect(await verifyPassword(password, user?.passwordHash)).toBe(true);
      expect(await verifyPassword("MitroAdmin123!", user?.passwordHash)).toBe(
        email === "admin@drivemitro.com"
      );
    }
  });
});
