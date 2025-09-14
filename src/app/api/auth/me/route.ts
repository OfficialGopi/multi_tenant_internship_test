import { checkUser } from "@/middlewares/checkUser";
import { NextResponse } from "next/server";

async function POST(req: Request) {
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
}

export { POST };
