import {
	createUser,
	createProfile,
	createAddress,
} from '@/controllers/users-controller'
import { authenticateToken, validateBody } from '@/middlewares'
import { profileSchema, userSchema, addressInputSchema } from '@/schemas'
import { Router } from 'express'

const usersRouter = Router()

usersRouter
	.post('/sign-up', validateBody(userSchema), createUser)
	.use(authenticateToken)
	.post('/sign-up/profile', validateBody(profileSchema), createProfile)
	.post('/sign-up/address', validateBody(addressInputSchema), createAddress)

export { usersRouter }
