import savesRepository from "@/repositories/saves-repository";

async function getAllSaveCategories() {
  const categories = await savesRepository.findAllCategories();

  return categories.map((category) => ({
    ...category,
    name: SaveCategories[category.name],
  }));
}

enum SaveCategories {
  SOFT = "Suave",
  MEDIUM = "Da pra aguentar",
  HARD = "Urgente",
}

export default {
  getAllSaveCategories,
};
