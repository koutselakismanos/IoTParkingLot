import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    const parkingLot = await tx.parkingLot.create({
      data: {
        name: 'Fake Parking Model IoT',
        location: 'Heraklion',
      },
    });

    await tx.parkingSpace.createMany({
      data: [
        {
          parkingLotId: parkingLot.id,
          name: 'A1',
        },
        {
          parkingLotId: parkingLot.id,
          name: 'A2',
        },
      ],
    });

    const parkingLot2 = await tx.parkingLot.create({
      data: {
        name: 'Example Parking Lot',
        location: 'Heraklion',
      },
    });

    await tx.parkingSpace.createMany({
      data: [
        {
          parkingLotId: parkingLot2.id,
          name: 'A1',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'A2',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'A3',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'A4',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'B1',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'B2',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'B3',
        },
        {
          parkingLotId: parkingLot2.id,
          name: 'B4',
        },
      ],
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
