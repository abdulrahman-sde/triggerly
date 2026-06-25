import prisma from "@/lib/prisma";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    console.log("Fetching workflows for user:", ctx.user.id);
    return await prisma.workflow.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.workflow.findFirst({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });
    }),

  create: premiumProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.workflow.create({
        data: {
          name: input.name,
          userId: ctx.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.workflow.deleteMany({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.workflow.updateMany({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
});
