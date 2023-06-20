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

async function findSavesByCoordinates(lat: number, lng: number) {}

async function create(save: SaveForm, profileId: number) {
  return prisma.$transaction(async (tsx) => {
    const {
      neighborhood,
      cep,
      city,
      complement,
      number,
      state,
      street,
      latitude,
      longitude,
    } = save.address;

    await tsx.$executeRaw` INSERT INTO addresses (neighborhood, cep, city, complement, number, state, street, latitude, longitude, geolocation)
    VALUES (${neighborhood}, ${cep}, ${city}, ${complement}, ${number}, ${state}, ${street}, ${latitude}, ${longitude}, extensions.ST_MakePoint(${longitude}, ${latitude}))`;

    const { id: addressId } = await tsx.address.findFirst({
      where: { latitude, longitude },
    });

    await tsx.save.create({
      data: {
        description: save.description,
        requester: {
          connect: {
            id: profileId,
          },
        },
        address: {
          connect: {
            id: addressId,
          },
        },
        category: {
          connect: {
            id: save.categoryId,
          },
        },
      },
    });
  });
}

export default {
  findAllCategories,
  create,
  findSavesByProviderId,
  findSavesByRequesterId,
  findSavesByCoordinates,
};
