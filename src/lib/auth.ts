import { polar, checkout, portal } from "@polar-sh/better-auth";
import { polarClient } from "@/lib/polar";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "5045f3de-b685-4a97-b8c9-9d30c7610307",
              slug: "Visual-Workflow-Automation",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL!,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
  ],
});
