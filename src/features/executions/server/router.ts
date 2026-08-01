import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const executionsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.execution.findMany({
      where: {
        userId: ctx.user.id,
      },
      include: {
        workflow: true,
      },
      orderBy: {
        startedAt: "desc",
      },
    });
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.execution.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: {
          workflow: true,
        },
      });
    }),
});
