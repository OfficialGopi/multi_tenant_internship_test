import { checkUser } from "@/middlewares/checkUser";
import { NextResponse } from "next/server";
import { db } from "@/db";
const GET = async (req: Request) => {
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

    const tenant = await db.tenant.findUnique({
      where: {
        id: user.tenantId,
      },
    });

    return NextResponse.json({
      status: "ok",
      success: true,
      data: {
        tenant,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
        statusText: "Internal Server Error",
      }
    );
  }
};

export { GET };
