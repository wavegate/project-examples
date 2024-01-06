import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const severityRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.severity.create({
        data: {
          name: input.name,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.severity.delete({ where: { id: input.id } });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.severity.findMany({});
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.severity.findUnique({
        where: { id: input.id },
      });
    }),
});
