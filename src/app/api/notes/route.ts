import { createNotesSchema } from "@/schemas/schemas";
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

    const body = await req.json();

    const { data, success } = createNotesSchema.safeParse(body);

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

    const tenant = await db.tenant.findUnique({
      where: {
        id: user.tenantId,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message: "Tenant not found",
        },
        {
          status: 404,
          statusText: "Not Found",
        }
      );
    }

    if (!tenant.isPro && tenant.totalNotes === 3) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message:
            "Your tenant have reached the limit of notes. Upgrade to Pro to create more notes.",
        },
        {
          status: 400,
          statusText: "Bad Request",
        }
      );
    }

    await db.tenant.update({
      where: {
        id: user.tenantId,
      },
      data: {
        totalNotes: {
          increment: 1,
        },
      },
    });

    const createdNote = await db.note.create({
      data: {
        title: data.title,
        content: data.content,
        tenantId: user.tenantId,
        creatorId: user.id,
      },
      include: {
        creator: true,
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        success: true,
        data: {
          note: createdNote,
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

async function GET(req: Request) {
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

  const notes = await db.note.findMany({
    where: {
      tenantId: user.tenantId,
    },
    include: {
      creator: true,
    },
  });

  return NextResponse.json({
    status: "ok",
    success: true,
    data: {
      notes: notes,
    },
  });
}

export { GET };
