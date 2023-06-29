import Joi from 'joi'
import { JOI_ERROR_MESSAGES } from '@/utils/constants/JOI_ERROR_MESSAGES'

export const signInSchema = Joi.object({
	login: Joi.string().required().messages(JOI_ERROR_MESSAGES.USER.login),
	password: Joi.string().required().messages(JOI_ERROR_MESSAGES.USER.password),
})
