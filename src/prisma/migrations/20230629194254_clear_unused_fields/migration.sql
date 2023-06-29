/*
  Warnings:

  - You are about to drop the column `name` on the `components` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `models` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `qualities` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "components_name_key";

-- DropIndex
DROP INDEX "models_name_key";

-- DropIndex
DROP INDEX "qualities_name_key";

-- AlterTable
ALTER TABLE "components" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "models" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "qualities" DROP COLUMN "name";
