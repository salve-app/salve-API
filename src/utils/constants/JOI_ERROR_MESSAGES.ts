export const JOI_ERROR_MESSAGES = {
	USER: {
		login: {
			'string.base': 'O login deve ser um texto',
			'any.required': 'Login é um campo obrigatório',
		},
		password: {
			'string.base': 'A senha deve ser um texto',
			'string.min': 'A senha deve ter no mínimo 8 dígitos',
			'any.required': 'A senha é um campo obrigatório',
		},
		email: {
			'string.base': 'O email deve ser um texto',
			'any.required': 'Email é um campo obrigatório',
		},
		username: {
			'string.base': 'O nome de usuário deve ser um texto',
			'any.required': 'O nome de usuário é um campo obrigatório',
		},
	},
	PROFILE: {
		fullName: {
			'string.base': 'Nome completo deve ser um texto',
			'any.required': 'Nome completo é um campo obrigatório',
		},
		cpf: {
			'string.base': 'CPF deve conter apenas números',
			'string.length': 'CPF contém caracteres insuficiente',
			'any.required': 'CPF deve ser obrigatório',
		},
		gender: {
			'string.base': 'Genero deve conter apenas texto',
			'any.required': 'Genero deve ser obrigatório',
			'any.only': 'Genero não é valido',
		},
		phoneNumber: {
			'string.base': 'O telefone deve conter apenas números',
			'string.length': 'Telefone contém números insuficientes',
			'any.required': 'O telefone é um campo obrigatório',
		},
		birthday: {
			'date.base': 'A data de nascimento inserida não é válida',
			'any.required': 'A data de nascimento é obrigatória',
		},
	},
	ADDRESS: {
		cep: {
			'string.base': 'CEP deve ser um texto',
			'string.length': 'CEP contém números insuficientes',
			'any.required': 'CEP é um campo obrigatório',
		},
		neighborhood: {
			'string.base': 'Bairro deve ser um texto',
			'any.required': 'Bairro é um campo obrigatório',
		},
		street: {
			'string.base': 'A rua deve ser um texto',
			'any.required': 'A rua é um campo obrigatório',
		},
		number: {
			'string.base': 'O campo número deve conter somente números',
			'any.required': 'Número é um campo obrigatório',
		},
		city: {
			'string.base': 'A cidade deve ser um texto',
			'any.required': 'A cidade é um campo obrigatório',
		},
		state: {
			'string.base': 'O estado deve ser um texto',
			'any.required': 'O estado é um campo obrigatório',
		},
		latitude: {
			'string.base': 'Latitude deve ser um número',
			'any.required': 'Latitude é um campo obrigatório',
		},
		longitude: {
			'string.base': 'Longitude deve ser um número',
			'any.required': 'Longitude é um campo obrigatório',
		},
	},
	SAVE: {
		description: {
			'string.base': 'A descrição do Salve inserida não é válida',
			'any.required': 'A descrição do Salve é obrigatória',
		},
		categoryId: {
			'number.base': 'O id da categoria deve ser um número',
			'number.min': 'O id da categoria está inválido',
			'any.required': 'O id da categoria é obrigatório',
		},
		cost: {
			'number.base': 'O custo deve ser um número',
			'any.only': 'O custo está inválido',
			'any.required': 'O custo é obrigatório',
		},
	},
}
