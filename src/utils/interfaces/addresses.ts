export interface ViaCepResult {
	cep: string
	logradouro: string
	complemento: string
	bairro: string
	localidade: string
	uf: string
	erro?: boolean
}

export interface Address {
	cep: string
	neighborhood: string
	street: string
	number: string
	complement?: string
	city: string
	state: string
	latitude: number
	longitude: number
}
