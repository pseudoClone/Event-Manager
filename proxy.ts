import { NextRequest, NextResponse } from "next/server";


function isServerActionPost(request: NextRequest) {
        if (request.method !== "POST") {
                return false;
        }
        const h = request.headers;
        return Boolean(h.get("Next-Action") ?? h.get("next-action"));
}

export default async function proxy(request: NextRequest) {
        const { auth } = await import("@/lib/auth/server");
        const { pathname } = request.nextUrl;
        if (isServerActionPost(request)) {
                return NextResponse.next();
        }
        if (pathname === "/") {
                return NextResponse.next();
        }

        return auth.middleware({ loginUrl: "/auth/sign-in" })(request);
        // This function checks if the user is authenticated on EVERY request inside the app and redirect to the loginUrl if not.
}

export const config = {
        matcher: [
                "/((?!_next/static|_next/image|favicon.ico).*)"
        ],
        /* Don't ask me this because this was in Next.js docs:
                1. https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
                2. https://github.com/pillarjs/path-to-regexp#path-to-regexp-1
        */
}