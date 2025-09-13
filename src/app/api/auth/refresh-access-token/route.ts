import { generateTokens, verifyToken } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { checkUser } from "@/middlewares/checkUser";
async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refresh-token");

    if (!refreshToken || !refreshToken.value) {
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

    const { data, success, message } = verifyToken(refreshToken.value, true);

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

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id,
      user.tenantId,
      user.role
    );

    cookieStore.set("access-token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    cookieStore.set("refresh-token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return NextResponse.json(
      {
        status: "ok",
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
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
}

export { PUT };
