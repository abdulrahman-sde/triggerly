-- AlterTable
ALTER TABLE "connection" ADD COLUMN     "fromOutput" TEXT NOT NULL DEFAULT 'main',
ADD COLUMN     "toInput" TEXT NOT NULL DEFAULT 'main';
