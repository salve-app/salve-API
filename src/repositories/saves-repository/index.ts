import { prisma } from '@/config/database'
import { SaveForm } from '@/services/saves-service'
import { Save } from '@/utils/interfaces/saves'

async function findAllCategories() {
	return prisma.saveCategory.findMany({
		select: {
			id: true,
			name: true,
			cost: true,
		},
	})
}

async function findSavesByProfileId(profileId: number): Promise<Array<Save>> {
	return prisma.save.findMany({
		where: {
			OR: [
				{
					requesterId: profileId,
				},
				{
					providerId: profileId,
				},
			],
			NOT: {
				status: 'COMPLETED',
			},
		},
		orderBy: {
			id: 'desc',
		},
		select: {
			id: true,
			description: true,
			status: true,
			address: {
				select: {
					id: true,
					cep: true,
					city: true,
					complement: true,
					latitude: true,
					longitude: true,
					neighborhood: true,
					number: true,
					street: true,
					state: true,
				},
			},
			category: {
				select: {
					id: true,
					name: true,
					cost: true,
				},
			},
			requester: {
				select: {
					id: true,
					fullName: true,
				},
			},
			provider: {
				select: {
					id: true,
					fullName: true,
				},
			},
		},
	})
}

async function findNearbySavesByCoordinates(
	latitude: number,
	longitude: number,
	range: number,
	profileId: number
): Promise<Array<Save>> {
	const saves = (await prisma.$queryRaw`
  SELECT  sv.id, sv.description, sv.status,
          json_build_object(
			'id', ad.id,
            'cep', ad.cep,
            'city', ad.city,
            'complement', ad.complement,
            'latitude', ad.latitude,
            'longitude', ad.longitude,
            'neighborhood', ad.neighborhood,
            'number', ad.number,
            'street', ad.street,
            'state', ad.state
          ) AS address,
          json_build_object(
			'id', ct.id,
            'name', ct."name",
            'cost', ct."cost"
          ) AS category,
          json_build_object(
			'id', pf.id,
            'fullName', pf."fullName"
          ) AS requester
  FROM saves sv
  JOIN addresses ad ON ad.id = sv."addressId"
  JOIN saves_categories ct ON ct.id = sv."categoryId"
  JOIN profiles pf ON pf.id = sv."requesterId"
  WHERE extensions.ST_DWithin(
    geolocation,
    extensions.ST_MakePoint(${longitude}, ${latitude})::extensions.geography, ${range}) AND sv."requesterId" <> ${profileId} AND sv.status = 'CREATED'
  ORDER BY sv.id DESC
`) as Array<Save>
	return saves
}

async function create(save: SaveForm, profileId: number) {
	return prisma.$transaction(async (tsx) => {
		const {
			neighborhood,
			cep,
			city,
			complement,
			number,
			state,
			street,
			latitude,
			longitude,
		} = save.address

		await tsx.$executeRaw` INSERT INTO addresses (neighborhood, cep, city, complement, number, state, street, latitude, longitude, geolocation)
    VALUES (${neighborhood}, ${cep}, ${city}, ${complement}, ${number}, ${state}, ${street}, ${latitude}, ${longitude}, extensions.ST_MakePoint(${longitude}, ${latitude}))`

		const { id: addressId } = await tsx.address.findFirst({
			where: { latitude, longitude },
		})

		await tsx.save.create({
			data: {
				description: save.description,
				requester: {
					connect: {
						id: profileId,
					},
				},
				address: {
					connect: {
						id: addressId,
					},
				},
				category: {
					connect: {
						id: save.categoryId,
					},
				},
			},
		})

		await tsx.profile.update({
			where: {
				id: profileId,
			},
			data: {
				coins: {
					decrement: save.cost,
				},
			},
		})
	})
}

async function findById(id: number) {
	return prisma.save.findUnique({
		where: {
			id,
		},
	})
}

async function updateSaveStatusToInProgress(id: number, providerId: number) {
	return prisma.save.update({
		where: {
			id,
		},
		data: {
			providerId,
			status: 'IN_PROGRESS',
		},
	})
}

async function updateSaveStatusToComplete(id: number, rating: number) {
	return prisma.save.update({
		where: {
			id,
		},
		data: {
			status: 'COMPLETED',
			rating: {
				create: {
					request_rating: rating,
				},
			},
		},
	})
}

export default {
	create,
	findAllCategories,
	findSavesByProfileId,
	findNearbySavesByCoordinates,
	findById,
	updateSaveStatusToInProgress,
	updateSaveStatusToComplete,
}
