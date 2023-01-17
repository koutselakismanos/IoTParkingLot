-- AlterTable
ALTER TABLE "ParkingSpace" ADD COLUMN     "parkingLotId" INTEGER;

-- AlterTable
ALTER TABLE "ParkingSpaceHistory" ADD COLUMN     "parkingSpaceId" INTEGER;

-- AddForeignKey
ALTER TABLE "ParkingSpace" ADD CONSTRAINT "ParkingSpace_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "ParkingLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParkingSpaceHistory" ADD CONSTRAINT "ParkingSpaceHistory_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "ParkingSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
