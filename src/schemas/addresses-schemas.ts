import { JOI_ERROR_MESSAGES } from '@/utils/constants/JOI_ERROR_MESSAGES'
import Joi from 'joi'

export const addressInputSchema = Joi.object().keys({
	cep: Joi.string()
		.length(9)
		.required()
		.messages(JOI_ERROR_MESSAGES.ADDRESS.cep),
	neighborhood: Joi.string()
		.required()
		.messages(JOI_ERROR_MESSAGES.ADDRESS.neighborhood),
	street: Joi.string().required().messages(JOI_ERROR_MESSAGES.ADDRESS.street),
	number: Joi.string().required().messages(JOI_ERROR_MESSAGES.ADDRESS.street),
	complement: Joi.string().allow(''),
	city: Joi.string().required().messages(JOI_ERROR_MESSAGES.ADDRESS.city),
	state: Joi.string().required().messages(JOI_ERROR_MESSAGES.ADDRESS.state),
	nickname: Joi.string(),
	latitude: Joi.number()
		.required()
		.messages(JOI_ERROR_MESSAGES.ADDRESS.latitude),
	longitude: Joi.number()
		.required()
		.messages(JOI_ERROR_MESSAGES.ADDRESS.longitude),
})
