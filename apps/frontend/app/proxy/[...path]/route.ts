import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY_URL =
    process.env.NEXT_PUBLIC_BE_URL! || "http://localhost:3000";
export const dynamic = "force-dynamic";

function headersToObject(h: Headers) {
    const obj: Record<string, string> = {};
    for (const [k, v] of h.entries()) obj[k] = v;
    return obj;
}

async function proxy(req: NextRequest) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/proxy/, "");
    const destUrl = `${API_GATEWAY_URL}${path}${url.search}`;

    // Read request headers and cookie
    const reqHeaders = new Headers(req.headers);
    const reqHeadersObj = headersToObject(reqHeaders);

    // Read request body (if any) but limit log size
    let reqBody: string | undefined;
    const hasBody = ["POST", "PATCH", "PUT", "DELETE"].includes(req.method);
    if (hasBody) {
        try {
            reqBody = await req.text();
            if (reqBody.length > 2000)
                reqBody = reqBody.slice(0, 2000) + "... (truncated)";
        } catch (e) {
            reqBody = `<<error reading body: ${String(e)}>>`;
        }
    }

    // Log incoming request (server console)
    console.log("---- PROXY REQUEST (FE -> Next.js) ----");
    console.log("method:", req.method);
    console.log("incoming url:", req.url);
    console.log("proxied destUrl:", destUrl);
    console.log("request headers:", JSON.stringify(reqHeadersObj, null, 2));
    console.log(
        "request cookies (header):",
        reqHeadersObj["cookie"] ?? "<none>"
    );
    console.log(
        "request authorization (header):",
        reqHeadersObj["authorization"] ?? "<none>"
    );
    console.log("request body (truncated):", reqBody ?? "<no body>");
    console.log("sending fetch credentials: include");
    console.log("---------------------------------------");

    // Build headers to forward (clone original)
    const forwardHeaders = new Headers(req.headers);
    // don't override host unless absolutely necessary
    // forwardHeaders.set("host", new URL(API_GATEWAY_URL).host);

    // Perform fetch to API gateway
    const response = await fetch(destUrl, {
        method: req.method,
        headers: forwardHeaders,
        body: hasBody ? reqBody : undefined,
        credentials: "include",
    });

    // Collect response headers and body size
    const resHeaders = new Headers(response.headers);
    const resHeadersObj = headersToObject(resHeaders);
    const setCookie = resHeaders.get("set-cookie") ?? "<none>";

    // Try to get response text for logging but limit size
    let respPreview: string | undefined;
    try {
        const cloned = response.clone();
        const text = await cloned.text();
        respPreview =
            text.length > 2000 ? text.slice(0, 2000) + "... (truncated)" : text;
    } catch (e) {
        respPreview = `<<error reading response text: ${String(e)}>>`;
    }

    console.log("---- PROXY RESPONSE (BE -> Next.js -> FE) ----");
    console.log("destUrl status:", response.status);
    console.log("response headers:", JSON.stringify(resHeadersObj, null, 2));
    console.log("response set-cookie:", setCookie);
    console.log("response preview (truncated):", respPreview ?? "<no preview>");
    console.log("---------------------------------------------");

    // Remove problematic headers so Next.js recomputes content-length etc.
    resHeaders.delete("content-encoding");
    resHeaders.delete("transfer-encoding");
    resHeaders.delete("content-length");

    // Forward Set-Cookie explicitly if present
    if (setCookie && setCookie !== "<none>") {
        resHeaders.set("set-cookie", setCookie);
    }

    // Stream response body back to client
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
