import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY_URL = process.env.NEXT_PUBLIC_BE_URL! || "http://localhost:3000";
export const dynamic = "force-dynamic";

async function proxy(req: NextRequest) {
    const url = new URL(req.url);

    // Forward full path after /api
    const path = url.pathname.replace(/^\/api/, ""); // /api/user/profile -> /user/profile
    const destUrl = `${API_GATEWAY_URL}/api${path}${url.search}`;

    // Copy headers and body
    const headers = new Headers(req.headers);
    headers.set("host", new URL(API_GATEWAY_URL).host);

    const body = ["POST", "PATCH", "PUT", "DELETE"].includes(req.method!)
        ? await req.text()
        : undefined;

    const response = await fetch(destUrl, {
        method: req.method,
        headers,
        body,
        credentials: "include",
    });

    const resHeaders = new Headers(response.headers);
    resHeaders.delete("content-encoding");

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
        status: response.status,
        headers: resHeaders,
    });
}

// Handle all methods
export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };