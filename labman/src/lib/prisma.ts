import { PrismaClient } from '@/generated/prisma'


let prisma: PrismaClient

if (process.env.NODE_ENV === 'test') {
    console.log(process.env.NODE_ENV)

    prisma = new PrismaClient({
        datasourceUrl: 'postgresql://postgres:postgres@postgres:5432/postgres',
    });

} else {
    console.log(process.env.NODE_ENV)

    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

    prisma =
        globalForPrisma.prisma || new PrismaClient()
// Prevent creation of duplicate Prisma Clients/connections to database in dev environment
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

}

export default prisma

