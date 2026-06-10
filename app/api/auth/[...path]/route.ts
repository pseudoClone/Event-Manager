import { auth } from "@/lib/auth/server";
export const { GET, POST, PUT, PATCH, DELETE } = auth.handler();
// This api route will handle the sign ups and signins of the user and create auth tables at Neon's manageed db