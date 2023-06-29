-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INPROCESS', 'DONE');

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operations" (
    "id" SERIAL NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "orderId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "modelId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "qualityId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "components" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qualities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "qualities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calls" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tel" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "calls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operations_orderId_status_key" ON "operations"("orderId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "services_modelId_componentId_qualityId_key" ON "services"("modelId", "componentId", "qualityId");

-- CreateIndex
CREATE UNIQUE INDEX "employees_login_key" ON "employees"("login");

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "components_name_key" ON "components"("name");

-- CreateIndex
CREATE UNIQUE INDEX "qualities_name_key" ON "qualities"("name");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "components"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_qualityId_fkey" FOREIGN KEY ("qualityId") REFERENCES "qualities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
