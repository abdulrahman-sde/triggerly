-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('INITIAL');

-- CreateTable
CREATE TABLE "node" (
    "id" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "position" JSONB NOT NULL,
    "workflowId" TEXT NOT NULL,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "connection" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,

    CONSTRAINT "connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "connection_fromNodeId_toNodeId_workflowId_key" ON "connection"("fromNodeId", "toNodeId", "workflowId");

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connection" ADD CONSTRAINT "connection_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
