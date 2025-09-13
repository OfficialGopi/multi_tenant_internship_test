import { loginBodySchema } from "@/schemas/schemas";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { comparePassword } from "@/utils/bcrypt";
import { generateTokens } from "@/utils/jwt";
import { cookies } from "next/headers";
import { sanitizeUser } from "@/utils/db.util";

async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, success } = loginBodySchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Both fields are required",
        },
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    let user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid credentials",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    //CHECK PASSWORD
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          status: "error",
          message: "Invalid credentials",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    // CREATE TOKENS
    const { accessToken, refreshToken } = generateTokens(
      user.id,
      user.tenantId,
      user.role
    );

    //SAVE REFRESH TOKEN TO DB
    user = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: refreshToken,
      },
    });

    //SET COOKIE
    const cookieStore = await cookies();

    cookieStore.set("access-token", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "strict",
      secure: true,
    });

    cookieStore.set("refresh-token", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
      secure: true,
    });

    //SEND RESPONSE

    return NextResponse.json(
      {
        status: "success",
        message: "Login successful",
        data: {
          user: sanitizeUser(user),
        },
      },
      {
        status: 200,
        statusText: "OK",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Something went wrong",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export { POST };
