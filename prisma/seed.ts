import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	const category = await prisma.saveCategory.findMany({})

	if (category.length !== 3) {
		await prisma.saveCategory.deleteMany({})
		await prisma.saveCategory.createMany({
			data: [
				{
					name: 'SOFT',
					cost: 1,
				},
				{
					name: 'MEDIUM',
					cost: 3,
				},
				{
					name: 'HARD',
					cost: 5,
				},
			],
		})
	}
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
