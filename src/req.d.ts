import { User } from "./generated/prisma";

declare global {
  interface Request {
    user: Partial<User> | undefined;
  }
}
