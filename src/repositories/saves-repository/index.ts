import { prisma } from "@/config/database";
import { SaveForm } from "@/services/saves-service";

async function findAllCategories() {
  return prisma.saveCategory.findMany({
    select: {
      id: true,
      name: true,
      cost: true,
    },
  });
}

async function findSavesByRequesterId(profileId: number) {
  return prisma.save.findMany({
    where: {
      requesterId: profileId,
    },
  });
}

async function findSavesByProviderId(profileId: number) {
  return prisma.save.findMany({
    where: {
      providerId: profileId,
    },
  });
}

async function create(save: SaveForm, profileId: number) {
  return prisma.save.create({
    data: {
      description: save.description,
      requester: {
        connect: {
          id: profileId,
        },
      },
      address: {
        create: {
          ...save.address,
        },
      },
      category: {
        connect: {
          id: save.categoryId,
        },
      },
    },
  });
}

export default {
  findAllCategories,
  create,
  findSavesByProviderId,
  findSavesByRequesterId,
};
