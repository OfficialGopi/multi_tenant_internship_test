import { PrismaClient } from "./generated/prisma";

declare global {
  namespace globalThis {
    var db: PrismaClient | undefined;
  }
}

export {};
