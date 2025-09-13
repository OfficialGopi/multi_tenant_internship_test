import { env } from "./constants/env";
import { PrismaClient } from "./generated/prisma/edge";

const prisma =
  globalThis.db ??
  new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.db = prisma;
}

export const db = prisma;
