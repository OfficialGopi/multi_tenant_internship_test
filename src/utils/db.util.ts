import { User } from "@/generated/prisma";

function sanitizeUser(user: User) {
  const sanitizedUser = {
    ...user,
    password: undefined,
    token: undefined,
  };
  return sanitizedUser;
}

export { sanitizeUser };
