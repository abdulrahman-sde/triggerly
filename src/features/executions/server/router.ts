import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

const paginationSchema = z.object({
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().positive().max(50).optional(),
});

export const executionsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(paginationSchema)
    .query(async ({ ctx, input }) => {
      const page = input.page ?? 1;
      const pageSize = input.pageSize ?? 9;

      const where = {
        userId: ctx.user.id,
      };

      const [items, total] = await Promise.all([
        prisma.execution.findMany({
          where,
          include: {
            workflow: true,
          },
          orderBy: {
            startedAt: "desc",
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.execution.count({ where }),
      ]);

      return {
        items,
        total,
        totalPages: Math.ceil(total / pageSize),
      };
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
