import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "@/repositories/user-repository";

async function signIn(params: SignInParams) {
  const { login, password } = params;

  const user = await getUserOrFail(login);

  await validatePasswordOrFail(password, user.password);

  const token = await createSession(user.id);

  return {
    email: user.email,
    username: user.username,
    token,
  };
}

async function getUserOrFail(login: string) {
  const user = await userRepository.findByLogin(login);
  if (!user) throw new Error("Invalid credentials");

  return user;
}

async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  return token;
}

async function validatePasswordOrFail(password: string, userPassword: string) {
  const isPasswordValid = await bcrypt.compare(password, userPassword);
  if (!isPasswordValid) throw new Error("Invalid credentials");
}

export type SignInParams = {
  login: string;
  password: string;
};

export default { signIn };
