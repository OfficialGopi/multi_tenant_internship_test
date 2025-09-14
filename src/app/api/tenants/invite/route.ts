import { Roles } from "@/generated/prisma/client";
import { inviteMemberToTenantSchema } from "@/schemas/schemas";
import { hashPassword } from "@/utils/bcrypt";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { checkUser } from "@/middlewares/checkUser";
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

    if (user.role !== Roles.ADMIN) {
      return NextResponse.json(
        {
          status: "error",
          message: "You are not authorized to perform this action",
        },
        {
          status: 403,
          statusText: "Forbidden",
        }
      );
    }

    const body = await req.json();

    const { data, success } = inviteMemberToTenantSchema.safeParse(body);

    if (!success || !data) {
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

    const hashedPassword = await hashPassword(data.password);

    if (!hashedPassword) {
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

    const addedUser = await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: Roles.MEMBER,
        tenantId: user.tenantId,
      },
    });

    return NextResponse.json({
      status: "ok",
      success: true,
      data: {
        user: addedUser,
      },
      message: "Member invited successfully",
    });
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
