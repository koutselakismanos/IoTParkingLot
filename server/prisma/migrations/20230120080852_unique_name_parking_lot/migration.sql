/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ParkingSpace` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,parkingLotId]` on the table `ParkingSpace` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ParkingSpace_name_key" ON "ParkingSpace"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSpace_name_parkingLotId_key" ON "ParkingSpace"("name", "parkingLotId");
