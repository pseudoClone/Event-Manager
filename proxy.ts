import { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
        const { auth } = await import("@/lib/auth/server");
        return auth.middleware({ loginUrl: "/auth/sign-in" })(request);
        // This function checks if the user is authenticated on EVERY request inside the app and redirect to the loginUrl if not.
}