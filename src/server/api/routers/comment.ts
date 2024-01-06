import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        bugId: z.number(),
        authorId: z.string(),
        parentId: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          content: input.content,
          bugId: input.bugId,
          authorId: input.authorId,
          ...(input.parentId && { parentId: input.parentId }),
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ content: z.string(), commentId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.update({
        where: { id: input.commentId },
        data: { content: input.content },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.delete({ where: { id: input.id } });
    }),
});
