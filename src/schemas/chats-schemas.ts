import Joi from 'joi'

export const messageSchema = Joi.object({
	saveId: Joi.number().min(1).required(),
	message: Joi.string().required(),
})
