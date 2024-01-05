import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { bugRouter } from "@/server/api/routers/bug";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  bug: bugRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
