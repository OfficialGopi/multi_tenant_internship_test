import { env } from "@/constants/env";
import { Roles } from "@/generated/prisma";
import jwt from "jsonwebtoken";

function generateTokens(
  userId: string,
  tenantId: string,
  role: (typeof Roles)[keyof typeof Roles] = Roles.MEMBER
) {
  const accessToken = jwt.sign(
    {
      userId,
      role,
      tenantId,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRY,
    } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    {
      userId,
      role,
      tenantId,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRY,
    } as jwt.SignOptions
  );
  return {
    accessToken,
    refreshToken,
  };
}

function verifyToken(token: string, isRefreshToken: boolean = false) {
  const secret = !isRefreshToken
    ? env.ACCESS_TOKEN_SECRET
    : env.REFRESH_TOKEN_SECRET;
  const data = jwt.verify(token, secret) as
    | jwt.JwtPayload & {
        userId?: string;
        role?: (typeof Roles)[keyof typeof Roles];
        tenantId?: string;
      };

  if (!data.exp || Date.now() >= data.exp * 1000) {
    return {
      data: null,
      success: false,
      message: "Session expired",
    };
  }

  if (
    !data.tenantId ||
    !data.userId ||
    !data.role ||
    !Object.values(Roles).includes(data.role)
  ) {
    return {
      data: null,
      success: false,
      message: "Please Login again",
    };
  }
  return {
    data: {
      userId: data.userId,
      role: data.role,
      tenantId: data.tenantId,
    },
    success: true,
  };
}

export { generateTokens, verifyToken };
