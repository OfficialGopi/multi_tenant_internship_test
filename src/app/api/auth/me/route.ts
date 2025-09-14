import { env } from "@/constants/env";
import { checkUser } from "@/middlewares/checkUser";
import { NextResponse } from "next/server";

async function POST(req: Request) {
  try {
    const user = await checkUser();

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

    return NextResponse.json(
      {
        status: "ok",
        success: true,
        data: {
          user,
        },
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
        error: env.NODE_ENV === "development" ? error : "Internal Server Error",
      },
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }
}

export { POST };
