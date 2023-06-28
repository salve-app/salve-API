export function formatSaveContent(saves) {
	return saves.map((save) => ({
		...save,
		category: { ...save.category, name: SaveCategories[save.category.name] },
	}))
}

export function getSeparetedSavesAccordinglyUserFunction(
	saves: Array<any>,
	profileId: number
) {
	const requested = saves.filter((save) => save.requester.id === profileId)

	const offering = saves.filter((save) => save.provider?.id === profileId)

	return { requested, offering }
}

enum SaveCategories {
  SOFT = 'Suave',
  MEDIUM = 'Da pra aguentar',
  HARD = 'Urgente',
}
