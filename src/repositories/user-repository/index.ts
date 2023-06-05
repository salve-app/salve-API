import { prisma } from "@/config/database";
import { CreateUserParams } from "@/services/users-service";

async function findByUsernameOrEmail(username: string, email: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      OR: [{ email }, { username }],
    },
  });
}

async function findByLogin(login: string) {
  return prisma.user.findFirstOrThrow({
    where: {
      OR: [{ email: login }, { username: login }],
    },
  });
}

async function create(data: CreateUserParams) {
  return prisma.user.create({
    data: {
      ...data,
    },
  });
}

export default { findByUsernameOrEmail, create, findByLogin };
