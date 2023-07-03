import { prisma } from '@/config/database'
import { AddressInputData } from '@/services/users-service'
import { faker } from '@faker-js/faker'

export async function createAddress(profileId: number) {
	const {
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
	} = generateValidAddressWithNickname()

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

export function generateValidAddressWithNickname(): AddressInputData {
	return {
		neighborhood: 'Centro',
		street: 'Avenida Doutor Luiz Guimarães',
		number: '449',
		complement: '',
		cep: '26210-022',
		city: 'Nova Iguaçu',
		state: 'RJ',
		latitude: -22.757629,
		longitude: -43.446023,
		nickname: 'Home',
	}
}

export function generateValidAddress() {
	return {
		neighborhood: 'Centro',
		street: 'Avenida Doutor Luiz Guimarães',
		number: '449',
		complement: '',
		cep: '26210-022',
		city: 'Nova Iguaçu',
		state: 'RJ',
		latitude: -22.757629,
		longitude: -43.446023,
	}
}

export function generateAddressWithInvalidCepFormat(): AddressInputData {
	return {
		neighborhood: 'Centro',
		street: 'Avenida Doutor Luiz Guimarães',
		number: '449',
		complement: '',
		cep: faker.lorem.word(9),
		city: 'Nova Iguaçu',
		state: 'RJ',
		latitude: -22.757629,
		longitude: -43.446023,
		nickname: 'Home',
	}
}

export function generateAddressWithNonExistentCep(): AddressInputData {
	return {
		neighborhood: 'Centro',
		street: 'Avenida Doutor Luiz Guimarães',
		number: '449',
		complement: '',
		cep: '99999-999',
		city: 'Nova Iguaçu',
		state: 'RJ',
		latitude: -22.757629,
		longitude: -43.446023,
		nickname: 'Home',
	}
}
