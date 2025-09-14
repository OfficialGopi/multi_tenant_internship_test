import { env } from "./constants/env";
import { PrismaClient } from "./generated/prisma";

const prisma = globalThis.db ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.db = prisma;
}

export const db = prisma;
