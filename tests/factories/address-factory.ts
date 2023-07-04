import { prisma } from '@/config/database'
import { AddressInputData } from '@/services/users-service'
import { faker } from '@faker-js/faker'
import { Address } from '@prisma/client'

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

export async function createAddressWithoutNickname(address: Partial<Address>) {
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
	} = address

	return prisma.$transaction(async (tsx) => {
		await tsx.$executeRaw`
      		INSERT INTO addresses (neighborhood, cep, city, complement, number, state, street, latitude, longitude, geolocation)
     		VALUES (${neighborhood}, ${cep}, ${city}, ${complement}, ${number}, ${state}, ${street}, ${latitude}, ${longitude}, extensions.ST_MakePoint(${longitude}, ${latitude}));
	  	`
		const { id: addressId } = await tsx.address.findFirst({
			where: { latitude, longitude },
			select: {
				id: true,
			},
		})

		return addressId
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

export function generateDistantValidAddress() {
	return {
		neighborhood: 'Centro',
		street: 'Rua Corinto Luíz Furtado',
		number: '30',
		complement: '',
		cep: '26130-560',
		city: 'Belford Roxo',
		state: 'RJ',
		latitude: -22.761547,
		longitude: -43.403146,
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
