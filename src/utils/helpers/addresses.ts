import { unprocessableEntity } from '@/errors'
import axios from 'axios'
import { ViaCepResult } from '../interfaces/addresses'
import { badRequest } from '@/errors/badRequest-error'

export function removeCepMask(cep: string) {
	return cep.replace('-', '')
}

export async function getAddressByCepOrThrow(cep: string) {
	const cepWithoutMask = removeCepMask(cep)

	if (cepWithoutMask.length !== 8 || !parseInt(cepWithoutMask))
		throw unprocessableEntity('O formato do CEP está errado!')

	const result = (
		await axios.get(`https://viacep.com.br/ws/${cepWithoutMask}/json/`)
	).data as ViaCepResult

	if (result.erro || !result) throw badRequest('CEP inválido')

	const {
		logradouro: street,
		bairro: neighborhood,
		localidade: city,
		uf: state,
	} = result

	return { street, neighborhood, city, state }
}
