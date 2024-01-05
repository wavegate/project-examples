import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const bugRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bug.create({
        data: {
          title: input.title,
          description: input.description,
          reporter: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bug.delete({ where: { id: input.id } });
    }),

  getLatest: protectedProcedure.query(({ ctx }) => {
    return ctx.db.bug.findFirst({
      orderBy: { createdAt: "desc" },
      where: { reporter: { id: ctx.session.user.id } },
    });
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.bug.findMany({
      orderBy: { createdAt: "desc" },
      where: { reporter: { id: ctx.session.user.id } },
    });
  }),
});
