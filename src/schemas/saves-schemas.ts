import Joi from 'joi'
import { addressInputSchema } from './addresses-schemas'
import { JOI_ERROR_MESSAGES } from '@/utils/constants/JOI_ERROR_MESSAGES'

export const saveSchema = Joi.object({
	description: Joi.string()
		.required()
		.messages(JOI_ERROR_MESSAGES.SAVE.description),
	categoryId: Joi.number()
		.min(1)
		.required()
		.messages(JOI_ERROR_MESSAGES.SAVE.categoryId),
	cost: Joi.number()
		.valid(1, 3, 5)
		.required()
		.messages(JOI_ERROR_MESSAGES.SAVE.cost),
	address: addressInputSchema,
})
