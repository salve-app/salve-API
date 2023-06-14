import userRepository from "@/repositories/user-repository";
import { Address, Profile, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { createSession } from "../auth-service";
import profileRepository from "@/repositories/profile-repository";

async function createUser({ username, email, password }: UserInputData) {
  await checkEmailOrUsernameExists(username, email);

  const hashedPassword = await bcrypt.hash(password, 10);

  const { id } = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
  });

  const jwtPayload = {
    username,
    email,
  };

  return { token: await createSession(jwtPayload, id) };
}

async function createProfile(data: ProfileInputData, userId: number) {
  const profileWithUser = await userRepository.createProfile(data, userId);

  const jwtPayload = {
    profileWithUser,
  };

  return { token: await createSession(jwtPayload, userId) };
}

async function createAddress(data: AddressInputData, userId: number) {
  const profile = await getUserProfileOrThrow(userId);

  const address = await profileRepository.createAddress(data, profile.id);

  const jwtPayload = {
    profile,
    address
  };

  return { token: await createSession(jwtPayload, userId) };
}

async function checkEmailOrUsernameExists(username: string, email: string) {
  const userExists = await userRepository.findByUsernameOrEmail(
    username,
    email
  );

  if (userExists) throw new Error("Usuário já existe!");
}


async function getUserProfileOrThrow(userId: number){
  const profile = await profileRepository.findByUserId(userId);

  if(!profile) throw new Error('O usuário não tem um perfil');

  return profile;
}

export type UserInputData = Pick<User, "email" | "password" | "username">;

export type ProfileInputData = Pick<
  Profile,
  "fullName" | "cpf" | "gender" | "birthday" | "phoneNumber"
>;

export type AddressInputData = Omit<Address, "id" | "createdAt"> & {
  nickname: string;
};

export default { createUser, createProfile, createAddress };
