-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'ADMIN');

-- AlterTable
ALTER TABLE "employees" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';

-- CreateTable
CREATE TABLE "actions" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "login" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "action" TEXT NOT NULL,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "actions" ADD CONSTRAINT "actions_login_fkey" FOREIGN KEY ("login") REFERENCES "employees"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
