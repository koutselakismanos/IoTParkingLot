import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (tx) => {
        const parkingLot = await tx.parkingLot.create({
            data: {
                name: "Parking Model", location: "Heraklion"
            }
        });

        await tx.parkingSpace.createMany({
            data: [{
                parkingLotId: parkingLot.id,
            }, {
                parkingLotId: parkingLot.id,
            }, {
                parkingLotId: parkingLot.id,
            }]
        });
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })