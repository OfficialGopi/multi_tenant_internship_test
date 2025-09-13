import { env } from "@/constants/env";
import { NextResponse } from "next/server";

function GET(req: Request) {
  env.ACCESS_TOKEN_EXPIRY;
  return NextResponse.json(
    {
      status: "ok",
    },
    {
      status: 200,
    }
  );
}
export { GET };
