import { singIn } from '@/controllers/auth-controller'
import { validateBody } from '@/middlewares'
import { signInSchema } from '@/schemas'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/sign-in', validateBody(signInSchema), singIn)

export { authRouter }
