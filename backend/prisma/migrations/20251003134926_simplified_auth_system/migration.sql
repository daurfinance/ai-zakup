/*
  Warnings:

  - You are about to drop the `Act` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bid` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Calendar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dispute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EscrowAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Fee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Guarantee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Security` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Act" DROP CONSTRAINT "Act_contractId_fkey";

-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_lotId_fkey";

-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_supplierCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_lotId_fkey";

-- DropForeignKey
ALTER TABLE "Contract" DROP CONSTRAINT "Contract_winnerBidId_fkey";

-- DropForeignKey
ALTER TABLE "EscrowAccount" DROP CONSTRAINT "EscrowAccount_customerCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "EscrowAccount" DROP CONSTRAINT "EscrowAccount_lotId_fkey";

-- DropForeignKey
ALTER TABLE "Guarantee" DROP CONSTRAINT "Guarantee_bidId_fkey";

-- DropForeignKey
ALTER TABLE "Guarantee" DROP CONSTRAINT "Guarantee_lotId_fkey";

-- DropForeignKey
ALTER TABLE "Lot" DROP CONSTRAINT "Lot_customerCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_actId_fkey";

-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_escrowId_fkey";

-- DropForeignKey
ALTER TABLE "Security" DROP CONSTRAINT "Security_bidId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_companyId_fkey";

-- DropTable
DROP TABLE "Act";

-- DropTable
DROP TABLE "AuditLog";

-- DropTable
DROP TABLE "Bid";

-- DropTable
DROP TABLE "Calendar";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Contract";

-- DropTable
DROP TABLE "Dispute";

-- DropTable
DROP TABLE "Document";

-- DropTable
DROP TABLE "EscrowAccount";

-- DropTable
DROP TABLE "Fee";

-- DropTable
DROP TABLE "Guarantee";

-- DropTable
DROP TABLE "Lot";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Payout";

-- DropTable
DROP TABLE "Security";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
