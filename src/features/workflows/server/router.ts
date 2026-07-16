import { NodeType } from "@/generated/prisma/enums";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { Edge, Node } from "@xyflow/react";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
  execute: premiumProcedure
    .input(
      z.object({
        workflowId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.workflowId,
          userId: ctx.user.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      const runId = crypto.randomUUID(); // <-- generate a unique runId for this execution

      await inngest.send({
        name: "workflows/execute.workflow",
        data: {
          workflowId: workflow.id,
          runId, // <-- include the runId in the event data
        },
      });

      return { message: "Workflow execution triggered", runId }; // <-- return it here
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.workflow.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        updatedAt: "desc",
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
        sourceHandle: connection.fromOutput || "main",
        targetHandle: connection.toInput || "main",
      }));
      return { ...workflow, nodes, edges };
    }),

  create: protectedProcedure
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            id: z.string(),
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Updating workflow with input:", input);
      const userId = ctx.user.id;
      const { id, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id, userId },
      });

      await prisma.$transaction(async (tx) => {
        // Delete existing nodes and edges
        await tx.node.deleteMany({
          where: { workflowId: workflow.id },
        });
        await tx.node.createMany({
          data: nodes.map((node) => ({
            id: node.id,
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
            workflowId: id,
          })),
        });

        await tx.connection.createMany({
          data: edges.map((edge) => ({
            id: edge.id,
            fromNodeId: edge.source,
            toNodeId: edge.target,
            fromOutput: edge.sourceHandle || "main",
            toInput: edge.targetHandle || "main",
            workflowId: id,
          })),
        });
        await tx.workflow.update({
          where: { id },
          data: {
            updatedAt: new Date(),
          },
        });
      });
      return workflow;
    }),
});
