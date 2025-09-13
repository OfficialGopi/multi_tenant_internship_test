import { NextResponse } from "next/server";

export default function middleware(req: Request) {
  // const url = req.url;

  // if (!url.startsWith("/api")) {
  //   return NextResponse.next();
  // }

  // if (
  //   url.startsWith("/api/auth/login") ||
  //   url.startsWith("/api/auth/refresh-access-token") ||
  //   url.startsWith("/api/health") ||
  //   url.startsWith("/api/tenants/create")
  // ) {
  //   return NextResponse.next();
  // }
  return NextResponse.next();
}
