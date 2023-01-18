/*
  Warnings:

  - Added the required column `name` to the `ParkingSpace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSpace" ADD COLUMN     "name" TEXT NOT NULL;
