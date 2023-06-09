import userRepository from "@/repositories/user-repository";
import { Profile, User } from "@prisma/client";
import bcrypt from "bcrypt";
import { createSession } from "../auth-service";

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

async function createProfile(data: ProfileInputData) {
  const profileWithUser = await userRepository.createProfile(data);

  const jwtPayload = {
    profileWithUser,
  };

  return { token: await createSession(jwtPayload, profileWithUser.userId) };
}

async function checkEmailOrUsernameExists(username: string, email: string) {
  const userExists = await userRepository.findByUsernameOrEmail(
    username,
    email
  );

  if (userExists) throw new Error("Usuário já existe!");
}

export type UserInputData = Pick<User, "email" | "password" | "username">;

export type ProfileInputData = Pick<
  Profile,
  "fullName" | "cpf" | "gender" | "birthday" | "phoneNumber" | "userId"
>;

export default { createUser, createProfile };
