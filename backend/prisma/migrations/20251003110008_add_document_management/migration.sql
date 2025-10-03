/*
  Warnings:

  - A unique constraint covering the columns `[tenderNumber]` on the table `Lot` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general';

-- AlterTable
ALTER TABLE "Lot" ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "contactInfo" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "deliveryTerms" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "lots" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "paymentTerms" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "tenderNumber" TEXT;

-- CreateIndex
CREATE INDEX "Document_entityType_entityId_idx" ON "Document"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Document_uploadedBy_idx" ON "Document"("uploadedBy");

-- CreateIndex
CREATE INDEX "Document_category_idx" ON "Document"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Lot_tenderNumber_key" ON "Lot"("tenderNumber");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");
