-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('PERSONAL', 'WORK', 'STUDY', 'PROJECT', 'DEVELOPMENT', 'DESIGN', 'MARKETING', 'HOME');

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "category" "TaskCategory" NOT NULL DEFAULT 'PERSONAL';
