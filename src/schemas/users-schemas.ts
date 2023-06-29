import { JOI_ERROR_MESSAGES } from '@/utils/constants/JOI_ERROR_MESSAGES'
import Joi from 'joi'

export const userSchema = Joi.object({
	email: Joi.string().email().required().messages(JOI_ERROR_MESSAGES.USER.email),
	username: Joi.string().required().messages(JOI_ERROR_MESSAGES.USER.username),
	password: Joi.string()
		.min(8)
		.required()
		.messages(JOI_ERROR_MESSAGES.USER.password),
})

export const profileSchema = Joi.object({
	fullName: Joi.string()
		.required()
		.messages(JOI_ERROR_MESSAGES.PROFILE.fullName),
	cpf: Joi.string()
		.length(14)
		.required()
		.messages(JOI_ERROR_MESSAGES.PROFILE.cpf),
	gender: Joi.string()
		.valid('M', 'F', 'NB', 'NI', 'OT')
		.required()
		.messages(JOI_ERROR_MESSAGES.PROFILE.gender),
	phoneNumber: Joi.string()
		.length(15)
		.required()
		.messages(JOI_ERROR_MESSAGES.PROFILE.phoneNumber),
	birthday: Joi.date().required().messages(JOI_ERROR_MESSAGES.PROFILE.birthday),
})
