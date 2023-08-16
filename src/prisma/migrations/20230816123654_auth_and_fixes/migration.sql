/*
  Warnings:

  - The `checked` column on the `calls` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "calls" DROP COLUMN "checked",
ADD COLUMN     "checked" TIMESTAMP(3);
