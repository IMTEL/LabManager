import dotenv from 'dotenv'

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})


import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma || new PrismaClient()
// Prevent creation of duplicate Prisma Clients/connections to database in dev environment
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma


