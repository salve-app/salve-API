import { AddressInputData } from '@/services/users-service'
import { faker } from '@faker-js/faker'

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

