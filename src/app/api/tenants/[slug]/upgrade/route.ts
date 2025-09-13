import { NextResponse } from "next/server";
import { db } from "@/db";
import { Roles } from "@/generated/prisma";
import { checkUser } from "@/middlewares/checkUser";

async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ slug: string }>;
  }
) {
  const user = await checkUser(req);

  if (!user) {
    return NextResponse.json(
      {
        status: "error",
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
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }

  const { slug } = await params;

  const tenant = await db.tenant.findUnique({
    where: {
      slug,
    },
  });

  if (!tenant) {
    return NextResponse.json(
      {
        status: "error",
        message: "Tenant not found",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  if (user.tenantId !== tenant.id) {
    return NextResponse.json(
      {
        status: "error",
        message: "You are not authorized to perform this action",
      },
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }

  if (tenant.isPro) {
    return NextResponse.json(
      {
        status: "error",
        message: "Tenant is already pro",
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  await db.tenant.update({
    where: {
      slug,
    },
    data: {
      isPro: true,
    },
  });

  return NextResponse.json(
    {
      status: "success",
      message: "Tenant upgraded to pro",
    },
    {
      status: 200,
      statusText: "OK",
    }
  );
}

export { POST };
