import Joi from 'joi'

export const idSchema = Joi.object({
	id: Joi.number().min(1).required(),
})

export const chatIdSchema = Joi.object({
	id: Joi.number().min(0).required(),
})
