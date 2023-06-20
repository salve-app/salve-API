import savesRepository from "@/repositories/saves-repository";
import { getUserProfileOrThrow } from "../users-service";
import { Decimal } from "@prisma/client/runtime";

async function getAllSaveCategories() {
  const categories = await savesRepository.findAllCategories();

  return categories.map((category) => ({
    ...category,
    name: SaveCategories[category.name],
  }));
}

async function createSave(save: SaveForm, userId: number) {
  const { id } = await getUserProfileOrThrow(userId);

  await savesRepository.create(save, id);
}

async function getRequestedSaves(userId: number) {
  const { id } = await getUserProfileOrThrow(userId);

  return savesRepository.findSavesByRequesterId(id);
}

async function getOfferingSaves(userId: number) {
  const { id } = await getUserProfileOrThrow(userId);

  return savesRepository.findSavesByProviderId(id);
}

enum SaveCategories {
  SOFT = "Suave",
  MEDIUM = "Da pra aguentar",
  HARD = "Urgente",
}
export interface SaveForm {
  description: string;
  categoryId: number;
  cost: number;
  address: AddressForm;
}
export interface AddressForm {
  cep: string;
  neighborhood: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  latitude: Decimal;
  longitude: Decimal;
}

export default {
  getAllSaveCategories,
  createSave,
  getRequestedSaves,
  getOfferingSaves,
};
