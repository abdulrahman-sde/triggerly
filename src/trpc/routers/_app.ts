import { workflowsRouter } from "@/features/workflows/server/router";
import { createTRPCRouter } from "../init";
import { CredentialsRouter } from "@/features/credentials/server/router";
import { executionsRouter } from "@/features/executions/server/router";
import { GoogleSheetsRouter } from "@/features/nodes/execution-nodes/google-sheets/server/router";
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: CredentialsRouter,
  executions: executionsRouter,
  googleSheets: GoogleSheetsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
