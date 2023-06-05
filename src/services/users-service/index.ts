import userRepository from "@/repositories/user-repository";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

async function createUser({ username, email, password }: CreateUserParams) {
  await checkUserExists(username, email);

  const hashedPassword = await bcrypt.hash(password, 10);
  return userRepository.create({
    username,
    email,
    password: hashedPassword,
  });
}

async function checkUserExists(username: string, email: string) {
  const userExists = await userRepository.findByUsernameOrEmail(
    username,
    email
  );

  if(userExists) throw new Error('Usuário já existe!')
}

export type CreateUserParams = Pick<User, "email" | "password" | "username">;

export default { createUser };
