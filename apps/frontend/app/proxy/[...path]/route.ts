import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY_URL =
    process.env.NEXT_PUBLIC_BE_URL! || "http://localhost:3000";
export const dynamic = "force-dynamic";


async function proxy(req: NextRequest) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/proxy/, "");
    const destUrl = `${API_GATEWAY_URL}${path}${url.search}`;

    const response = await fetch(destUrl, {
        method: req.method,
        headers: req.headers,
        body: ["POST", "PATCH", "PUT", "DELETE"].includes(req.method)
            ? await req.text()
            : undefined,
        credentials: "include",
        redirect: "manual", // important to catch Set-Cookie
    });

    const resHeaders = new Headers(response.headers);

    // ✅ Rewrite cookie domain to frontend domain
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
        const updatedCookie = setCookie.replace(
            /domain=[^;]+/i,
            "domain=sellmate-nine.vercel.app"
        );
        resHeaders.set("set-cookie", updatedCookie);
    }

    // Remove headers that will break NextResponse
    resHeaders.delete("content-length");
    resHeaders.delete("transfer-encoding");
    resHeaders.delete("content-encoding");

    return new NextResponse(response.body, {
        status: response.status,
        headers: resHeaders,
    });
}

export {
    proxy as GET,
    proxy as POST,
    proxy as PATCH,
    proxy as PUT,
    proxy as DELETE,
};
