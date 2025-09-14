import bcrypt from "bcryptjs";

async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, 10);
  } catch {
    return null;
  }
}

async function comparePassword(password: string, hashedPassword: string) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    return null;
  }
}

export { hashPassword, comparePassword };
