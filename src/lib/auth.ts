import type { APIRoute } from 'astro';

export function withAuth(handler: (userId: string, context: any) => ReturnType<APIRoute>): APIRoute {
  return async function (context) {
    const user = await context.locals.currentUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }
    return handler(user.id, context);
  };
}