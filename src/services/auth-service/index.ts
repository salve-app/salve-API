import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "@/repositories/user-repository";

async function signIn(data: SignInParams) {
  const { login, password } = data;

  const user = await getUserOrFail(login);

  await validatePasswordOrFail(password, user.password);

  const jwtPayload = {
    username: user.username,
    coins: user.Profile ? +user.Profile.coins : 0,
    hasProfile: !!user.Profile,
    hasAddress: !!user.Profile?.ProfileToAddress,
  };

  const token = await createSession(jwtPayload, user.id);

  return {
    token,
  };
}

async function getUserOrFail(login: string) {
  const user = await userRepository.findByLogin(login);
  if (!user) throw new Error("Invalid credentials");

  return user;
}

export async function createSession(payload: Object, userId: number) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
    subject: userId.toString(),
  });

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
