import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(
  plainText: string,
  hashedPassword?: string
): Promise<boolean> {
  if (!hashedPassword) return false;

  // For demo/seeded accounts, we also support direct check if plain match
  // or standard bcrypt compare
  try {
    return await bcrypt.compare(plainText, hashedPassword);
  } catch {
    return false;
  }
}
