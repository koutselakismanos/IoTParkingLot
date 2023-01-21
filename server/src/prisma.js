import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient({ log: ['info'] });

export default prisma;
