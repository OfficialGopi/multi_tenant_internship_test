import bcrypt from "bcryptjs";

async function hashPassword(password: string) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    return null;
  }
}

async function comparePassword(password: string, hashedPassword: string) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    return null;
  }
}

export { hashPassword, comparePassword };
