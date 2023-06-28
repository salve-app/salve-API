import { PrismaClient } from '@prisma/client'

export let prisma: PrismaClient

export function connectPrismaDb(): void {
	prisma = new PrismaClient()
}

export async function disconnectDb() {
	return prisma?.$disconnect
}
