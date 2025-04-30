import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isProtected = createRouteMatcher(["/app"]);
export const onRequest = clerkMiddleware((auth, context) => {
    const { userId, redirectToSignIn } = auth();
    if (isProtected(context.request) && !userId) {
        
        return redirectToSignIn();  
    }
});