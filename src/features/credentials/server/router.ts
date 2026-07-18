import { CredentialType } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const CredentialsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await prisma.credential.findMany({
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
      const credential = await prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });

      return credential;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.enum(CredentialType),
        value: z.string(),
        baseURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.credential.create({
        data: {
          name: input.name,
          type: input.type,
          value: input.value,
          baseURL: input.baseURL,
          userId: ctx.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.credential.deleteMany({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(CredentialType),
        value: z.string(),
        baseURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.credential.updateMany({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        data: {
          name: input.name,
          type: input.type,
          value: input.value,
          baseURL: input.baseURL,
        },
      });
    }),
});
