/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Campaign` table. All the data in the column will be lost.
  - The `status` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `endDate` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_projectId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "updatedAt",
ADD COLUMN     "adPerformanceMetrics" JSONB,
ADD COLUMN     "adPlatform" TEXT NOT NULL DEFAULT 'google',
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "targetKeywords" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
