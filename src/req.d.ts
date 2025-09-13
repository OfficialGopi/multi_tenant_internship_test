import { User } from "./generated/prisma";

declare global {
  interface Request {
    user:
      | (Partial<User> & {
          id: string;
          email: string;
          name: string;
          role: string;
          tenantId: string;
        })
      | undefined;
  }
}
