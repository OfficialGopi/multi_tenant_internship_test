import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { checkUser } from "@/middlewares/checkUser";
import { env } from "@/constants/env";

async function DELETE(req: Request) {
  try {
    const user = await checkUser();
    const cookiesStore = await cookies();

    if (!user) {
      cookiesStore.delete("access-token");
      cookiesStore.delete("refresh-token");

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

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        token: null,
      },
    });

    cookiesStore.delete("access-token");
    cookiesStore.delete("refresh-token");

    return NextResponse.json(
      {
        status: "ok",
        success: true,
        message: "Logout successful",
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
        message: "Something went wrong",
        error: env.NODE_ENV === "development" ? error : "Internal Server Error",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
}

export { DELETE };
