-- CreateEnum
CREATE TYPE "EntranceEvent" AS ENUM ('ENTRY', 'DEPARTURE');

-- CreateTable
CREATE TABLE "ParkingLotEvent" (
    "id" SERIAL NOT NULL,
    "event" "EntranceEvent" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parkingLotId" INTEGER,

    CONSTRAINT "ParkingLotEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParkingLotEvent" ADD CONSTRAINT "ParkingLotEvent_parkingLotId_fkey" FOREIGN KEY ("parkingLotId") REFERENCES "ParkingLot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
