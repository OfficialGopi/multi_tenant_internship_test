import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "./utils/jwt";
import { db } from "./db";
import { sanitizeUser } from "./utils/db.util";

export default function middleware(req: Request) {
  const url = req.url;

  console.log(url);

  //   if (url.startsWith("/api/auth")) {
  return NextResponse.next();
  //   }

  //   return checkUser(req);
}

async function checkUser(req: Request) {
  try {
    const cookiesStore = await cookies();

    const accessToken = cookiesStore.get("access-token");

    if (!accessToken) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message: "Please Login again",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    const { data, success, message } = verifyToken(accessToken.value, false);

    if (!success || !data) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message: message || "Please Login again",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    const user = await db.user.findUnique({
      where: {
        id: data.userId,
        role: data.role,
        tenantId: data.tenantId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message: "Please Login again",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    req.user = sanitizeUser(user);

    return NextResponse.next();
  } catch (error) {}
}
