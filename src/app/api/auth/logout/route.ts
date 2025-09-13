import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";

async function DELETE(req: Request) {
  const cookiesStore = await cookies();

  if (!req.user) {
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
      id: req.user.id,
    },
    data: {
      token: null,
    },
  });

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
}

export { DELETE };
