import { CredentialType } from "@/generated/prisma/enums";
import { encryptCredential } from "@/lib/credential-crypto";
import prisma from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

const maskCredential = <T extends { value: string }>(credential: T) => ({
  ...credential,
  value: "",
});

export const CredentialsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const credentials = await prisma.credential.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return credentials.map(maskCredential);
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

      return maskCredential(credential);
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
          value: encryptCredential(input.value),
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
        value: z.string().optional(),
        baseURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data: {
        name?: string;
        type?: CredentialType;
        value?: string;
        baseURL?: string;
      } = {
        name: input.name,
        type: input.type,
        baseURL: input.baseURL,
      };

      if (input.value) {
        data.value = encryptCredential(input.value);
      }

      return await prisma.credential.updateMany({
        where: {
          id: input.id,
          userId: ctx.user.id,
        },
        data,
      });
    }),
});
