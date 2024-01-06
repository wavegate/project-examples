import { postRouter } from "@/server/api/routers/post";
import { createTRPCRouter } from "@/server/api/trpc";
import { bugRouter } from "@/server/api/routers/bug";
import { severityRouter } from "@/server/api/routers/severity";
import { priorityRouter } from "@/server/api/routers/priority";
import { statusRouter } from "@/server/api/routers/status";
import { userRouter } from "@/server/api/routers/user";
import { environmentRouter } from "@/server/api/routers/environment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  bug: bugRouter,
  severity: severityRouter,
  priority: priorityRouter,
  status: statusRouter,
  user: userRouter,
  environment: environmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
