import { workflowsRouter } from "@/features/workflows/server/router";
import { createTRPCRouter } from "../init";
import { CredentialsRouter } from "@/features/credentials/server/router";
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: CredentialsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
