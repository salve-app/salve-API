import { Categories, Status } from '@prisma/client'
import { Address } from './addresses'

export interface Save {
	id: number
	description: string
	status: Status
	address: Partial<Address> & { id: number }
	category: {
		id: number
		name: Categories | RenamedCategories
		cost: number
	}
	requester: {
		id: number
		fullName: string
	}
	provider: {
		id: number
		fullName: string
	}
}

export enum RenamedCategories {
	SOFT = 'Suave',
	MEDIUM = 'Da pra aguentar',
	HARD = 'Urgente',
}
