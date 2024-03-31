/*
  Warnings:

  - Added the required column `eventId` to the `Rsvp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rsvp" ADD COLUMN     "eventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Rsvp" ADD CONSTRAINT "Rsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
