import { RenamedCategories, Save } from '../interfaces/saves'

export function formatSaveContent(saves: Array<Save>) {
	return saves.map((save) => ({
		...save,
		category: { ...save.category, name: RenamedCategories[save.category.name] },
	}))
}

export function getSeparetedSavesAccordinglyUserFunction(
	saves: Array<Save>,
	profileId: number
) {
	const requested = saves.filter((save) => save.requester.id === profileId)

	const offering = saves.filter((save) => save.provider?.id === profileId)

	return { requested, offering }
}
