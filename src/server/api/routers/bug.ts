import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";

const timeLengthSchema = z
  .object({
    weeks: z.number().optional(),
    days: z.number().optional(),
    hours: z.number().optional(),
    minutes: z.number().optional(),
  })
  .optional();

export const bugRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        stepsToReproduce: z.string().optional(),
        severityId: z.number().optional(),
        priorityId: z.number().optional(),
        statusId: z.number().optional(),
        environmentId: z.number().optional(),
        reporterId: z.string(),
        assigneeId: z.string().optional(),
        estimatedTime: timeLengthSchema,
        actualTime: timeLengthSchema,
        dependenciesIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bug.create({
        data: {
          title: input.title,
          description: input.description,
          stepsToReproduce: input.stepsToReproduce,
          severity: input.severityId
            ? { connect: { id: input.severityId } }
            : undefined,
          priority: input.priorityId
            ? { connect: { id: input.priorityId } }
            : undefined,
          status: input.statusId
            ? { connect: { id: input.statusId } }
            : undefined,
          environment: input.environmentId
            ? { connect: { id: input.environmentId } }
            : undefined,
          assignee: input.assigneeId
            ? { connect: { id: input.assigneeId } }
            : undefined,
          reporter: { connect: { id: ctx.session.user.id } },
          estimatedTime: input.estimatedTime
            ? {
                create: {
                  weeks: input.estimatedTime.weeks,
                  days: input.estimatedTime.days,
                  hours: input.estimatedTime.hours,
                  minutes: input.estimatedTime.minutes,
                },
              }
            : undefined,
          actualTime: input.actualTime
            ? {
                create: {
                  weeks: input.actualTime.weeks,
                  days: input.actualTime.days,
                  hours: input.actualTime.hours,
                  minutes: input.actualTime.minutes,
                },
              }
            : undefined,
          dependencies: input.dependenciesIds
            ? {
                connect: input.dependenciesIds.map((dependencyId) => ({
                  id: dependencyId,
                })),
              }
            : undefined,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
        description: z.string().optional(),
        stepsToReproduce: z.string().optional(),
        severityId: z.number().optional(),
        priorityId: z.number().optional(),
        statusId: z.number().optional(),
        environmentId: z.number().optional(),
        reporterId: z.string(),
        assigneeId: z.string().optional(),
        estimatedTime: timeLengthSchema,
        actualTime: timeLengthSchema,
        dependenciesIds: z.array(z.number()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const bugToUpdate = await ctx.db.bug.findUnique({
        where: { id: input.id },
        include: {
          estimatedTime: true,
          actualTime: true,
          dependencies: true,
        },
      });

      if (!bugToUpdate) {
        throw new Error("Bug not found");
      }

      const updateData: Prisma.BugUpdateArgs["data"] = {
        title: input.title,
        description: input.description,
        stepsToReproduce: input.stepsToReproduce,
        severity: input.severityId
          ? { connect: { id: input.severityId } }
          : undefined,
        priority: input.priorityId
          ? { connect: { id: input.priorityId } }
          : undefined,
        status: input.statusId
          ? { connect: { id: input.statusId } }
          : undefined,
        environment: input.environmentId
          ? { connect: { id: input.environmentId } }
          : undefined,
        assignee: input.assigneeId
          ? { connect: { id: input.assigneeId } }
          : undefined,
        reporter: { connect: { id: ctx.session.user.id } },
      };

      if (input.estimatedTime) {
        if (bugToUpdate.estimatedTime) {
          updateData.estimatedTime = {
            update: {
              data: {
                weeks: input.estimatedTime.weeks,
                days: input.estimatedTime.days,
                hours: input.estimatedTime.hours,
                minutes: input.estimatedTime.minutes,
              },
            },
          };
        } else {
          updateData.estimatedTime = {
            create: {
              weeks: input.estimatedTime.weeks,
              days: input.estimatedTime.days,
              hours: input.estimatedTime.hours,
              minutes: input.estimatedTime.minutes,
            },
          };
        }
      }
      if (input.actualTime) {
        if (bugToUpdate.actualTime) {
          updateData.actualTime = {
            update: {
              data: {
                weeks: input.actualTime.weeks,
                days: input.actualTime.days,
                hours: input.actualTime.hours,
                minutes: input.actualTime.minutes,
              },
            },
          };
        } else {
          updateData.actualTime = {
            create: {
              weeks: input.actualTime.weeks,
              days: input.actualTime.days,
              hours: input.actualTime.hours,
              minutes: input.actualTime.minutes,
            },
          };
        }
      }

      updateData.dependencies = {
        disconnect: bugToUpdate.dependencies?.map((dependency) => {
          return { id: dependency.id };
        }),
        connect: input.dependenciesIds?.map((id) => ({ id })),
      };

      return ctx.db.bug.update({
        where: {
          id: input.id,
        },
        data: updateData,
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
      include: {
        severity: true,
        priority: true,
        status: true,
        environment: true,
        assignee: true,
        reporter: true,
        estimatedTime: true,
        actualTime: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.bug.findUnique({
        where: { id: input.id },
        include: {
          severity: true,
          priority: true,
          status: true,
          environment: true,
          assignee: true,
          reporter: true,
          estimatedTime: true,
          actualTime: true,
          dependencies: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
      });
    }),
});
