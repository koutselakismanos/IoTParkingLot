/*
  Warnings:

  - You are about to drop the column `State` on the `ParkingSpaceHistory` table. All the data in the column will be lost.
  - Added the required column `state` to the `ParkingSpaceHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingSpaceHistory" DROP COLUMN "State",
ADD COLUMN     "state" "ParkingSpaceState" NOT NULL;
