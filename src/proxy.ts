import { NextResponse, type NextRequest } from "next/server";

const ALLOWED_HOSTS = ["janhellwich.com", "www.janhellwich.com", "localhost"];

export default function proxy(request: NextRequest) {
  const referer = request.headers.get("referer");

  if (referer) {
    try {
      const refererHost = new URL(referer).hostname;
      const allowed = ALLOWED_HOSTS.some(
        (h) => refererHost === h || refererHost.endsWith(`.${h}`)
      );
      if (!allowed) {
        return new NextResponse(null, { status: 403 });
      }
    } catch {
      return new NextResponse(null, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/media/:path*.mp4",
};
