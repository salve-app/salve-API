import { prisma } from "@/config/database";
import { AddressInputData } from "@/services/users-service";

async function findByUserId(userId: number) {
  return prisma.profile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

async function createAddress(
  {
    neighborhood,
    cep,
    city,
    complement,
    nickname,
    number,
    state,
    street,
  }: AddressInputData,
  profileId: number
) {
  return prisma.address.create({
    data: {
      neighborhood,
      cep,
      city,
      complement,
      number,
      state,
      street,
      ProfileToAddress: {
        create: {
          nickname,
          profileId,
        },
      },
    },
  });
}

export default {
  findByUserId,
  createAddress,
};
