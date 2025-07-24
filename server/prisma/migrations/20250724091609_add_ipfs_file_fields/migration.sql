/*
  Warnings:

  - You are about to drop the column `label` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `File` table. All the data in the column will be lost.
  - Added the required column `alias` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDuplicate` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfFiles` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinSize` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinataId` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `File` table without a default value. This is not possible if the table is not empty.
  - Made the column `cid` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "label",
DROP COLUMN "type",
ADD COLUMN     "alias" TEXT NOT NULL,
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "isDuplicate" BOOLEAN NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "numberOfFiles" INTEGER NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "pinSize" INTEGER NOT NULL,
ADD COLUMN     "pinataId" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "cid" SET NOT NULL;
