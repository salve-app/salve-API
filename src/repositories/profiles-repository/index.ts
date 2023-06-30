import { prisma } from '@/config/database'
import { AddressInputData } from '@/services/users-service'

async function findByUserId(userId: number) {
	return prisma.profile.findUnique({
		where: {
			userId,
		},
		include: {
			user: {
				select: {
					username: true,
				},
			},
		},
	})
}

async function findByCpf(cpf: string) {
	return prisma.profile.findUnique({
		where: {
			cpf,
		},
	})
}

async function createAddress(
	{
		neighborhood,
		cep,
		city,
		complement,
		nickname,
		number,
		state,
		street,
		latitude,
		longitude,
	}: AddressInputData,
	profileId: number
) {
	return prisma.$transaction(async (tsc) => {
		await tsc.$executeRaw`
      INSERT INTO addresses (neighborhood, cep, city, complement, number, state, street, latitude, longitude, geolocation)
      VALUES (${neighborhood}, ${cep}, ${city}, ${complement}, ${number}, ${state}, ${street}, ${latitude}, ${longitude}, extensions.ST_MakePoint(${longitude}, ${latitude}));
     `

		await tsc.$executeRaw`
      INSERT INTO profiles_addresses ("profileId", "addressId", nickname)
      VALUES (${profileId}, (SELECT id FROM addresses WHERE latitude = ${latitude} AND longitude = ${longitude} LIMIT 1), ${nickname});
    `
	})
}

export default {
	findByUserId,
	findByCpf,
	createAddress,
}
