import cors from 'cors'
import express, { json, Express } from 'express'

import { connectPrismaDb } from '@/config/database'
import loadEnv from '@/config/envs'
import { authRouter, chatsRouter, savesRouter, usersRouter } from '@/routers'
import { handleApplicationErrors } from '@/middlewares'

loadEnv()

const app: Express = express()

app
	.use(cors())
	.use(json())
	.use('/users', usersRouter)
	.use('/saves', savesRouter)
	.use('/chats', chatsRouter)
	.use('/auth', authRouter)
	.use(handleApplicationErrors)

export async function init(): Promise<Express> {
	connectPrismaDb()
	return Promise.resolve(app)
}

export default app
