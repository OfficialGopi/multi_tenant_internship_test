import { User } from "@prisma/client";

function sanitizeUser(user: User) {
  const sanitizedUser = {
    ...user,
    password: undefined,
    token: undefined,
  };
  return sanitizedUser;
}

export { sanitizeUser };
