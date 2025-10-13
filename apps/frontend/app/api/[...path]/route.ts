import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY_URL =
    process.env.NEXT_PUBLIC_BE_URL! || "http://localhost:3000";
export const dynamic = "force-dynamic";

async function proxy(req: NextRequest) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/api/, "");
    const destUrl = `${API_GATEWAY_URL}/api${path}${url.search}`;

    const headers = new Headers(req.headers);

    const body = ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)
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
    resHeaders.delete("transfer-encoding");
    resHeaders.delete("content-length");

    // Forward Set-Cookie
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
        resHeaders.set("set-cookie", setCookie);
    }

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
        status: response.status,
        headers: resHeaders,
    });
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE };
