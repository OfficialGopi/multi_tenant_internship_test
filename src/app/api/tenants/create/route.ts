import { createTenantSchema } from "@/schemas/schemas";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { hashPassword } from "@/utils/bcrypt";
import { Roles } from "@/generated/prisma";
async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, success } = createTenantSchema.safeParse(body);

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

    const createdTenant = await db.tenant.create({
      data: {
        name: data.tenantName,
        slug:
          data.tenantName.replace(/\s+/g, "-").toLowerCase() +
          Math.floor(Math.random() * 1000),
      },
    });
    const hashedPassword = await hashPassword(data.adminPassword);

    if (!hashedPassword) {
      await db.tenant.delete({
        where: {
          id: createdTenant.id,
        },
      });

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

    const createdAdmin = await db.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail,
        password: hashedPassword,
        role: Roles.ADMIN,
        tenantId: createdTenant.id,
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        data: {
          tenant: createdTenant,
          admin: createdAdmin,
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
