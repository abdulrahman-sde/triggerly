import prisma from "@/lib/prisma";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.workflow.findMany({
      where: {
        userId: ctx.user.id,
      },
    });
  }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });
      const nodes: Node[] = workflow.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));
      const edges: Edge[] = workflow?.connections.map((connection) => ({
        id: connection.id,
        source: connection.fromNodeId,
        target: connection.toNodeId,
      }));
      return { ...workflow, nodes, edges };
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
          nodes: {
            create: [
              {
                type: "INITIAL",
                position: { x: 0, y: 0 },
                data: {},
              },
            ],
          },
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
