import { prisma } from "@/config/database";

async function findAllCategories() {
  return prisma.saveCategory.findMany({
    select: {
      id: true,
      name: true,
      cost: true,
    },
  });
}

export default {
  findAllCategories,
};
