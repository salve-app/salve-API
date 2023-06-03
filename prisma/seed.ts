import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
 //inserts no banco aqui
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })