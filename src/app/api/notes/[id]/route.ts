import { NextResponse } from "next/server";
import { db } from "@/db";
import { Roles } from "@/generated/prisma/client";
import { updateNotesSchema } from "@/schemas/schemas";
import { checkUser } from "@/middlewares/checkUser";
import { env } from "@/constants/env";

async function GET(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

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

    if (!id) {
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

    const note = await db.note.findUnique({
      where: {
        id: id,
        tenantId: user.tenantId,
      },
      include: {
        creator: true,
      },
    });
    if (!note) {
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
          note,
        },
      },
      {
        status: 200,
        statusText: "ok",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        success: false,
        error: env.NODE_ENV === "development" ? error : "Internal Server Error",
        message: "Something went wrong",
      },
      {
        status: 500,
        statusText: "Something Went Wrong",
      }
    );
  }
}
export { GET };

async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

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

    if (!id) {
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
    const { data, success } = updateNotesSchema.safeParse(body);
    if (!success) {
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

    const note = await db.note.findUnique({
      where: {
        id: id,
        tenantId: user.tenantId,
      },
    });

    if (!note) {
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
    if (user.role !== Roles.ADMIN && note.creatorId !== user.id) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message: "You are not authorized to perform this action",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    if (!body) {
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

    const updateDataField: {
      title?: string;
      content?: string;
    } = {};

    if (body.title) {
      updateDataField.title = data.title;
    }
    if (body.content) {
      updateDataField.content = data.content;
    }

    const updatedNote = await db.note.update({
      where: {
        id: id,
      },
      data: updateDataField,
      include: {
        creator: true,
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        success: true,
        data: {
          note: updatedNote,
        },
      },
      {
        status: 200,
        statusText: "ok",
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        success: false,
        error: env.NODE_ENV === "development" ? error : "Internal Server Error",
        message: "Something went wrong",
      },
      {
        status: 500,
        statusText: "Something Went Wrong",
      }
    );
  }
}
export { PUT };

async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;
    if (!id) {
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

    const note = await db.note.findUnique({
      where: {
        id: id,
        tenantId: user.tenantId,
      },
    });

    if (!note) {
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

    if (user.role !== Roles.ADMIN && note.creatorId !== user.id) {
      return NextResponse.json(
        {
          status: "error",
          success: false,
          message: "You are not authorized to perform this action",
        },
        {
          status: 401,
          statusText: "Unauthorized",
        }
      );
    }

    await db.note.delete({
      where: {
        id: id,
      },
    });

    await db.tenant.update({
      where: {
        id: user.tenantId,
      },
      data: {
        totalNotes: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json(
      {
        status: "ok",
        success: true,
        message: "Note deleted successfully",
      },
      {
        status: 200,
        statusText: "ok",
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
        statusText: "Something Went Wrong",
      }
    );
  }
}
export { DELETE };
