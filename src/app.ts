import express, { json, Express } from 'express'
import cors from 'cors'
import loadEnv from './config/envs'
import { connectPrismaDb } from './config/database'

loadEnv()

const app: Express = express()

app
  .use(cors())
  .use(json())
  .get('/health', (_req, res) => {
    res.send('Ok').status(200)
  })

export async function init(): Promise<Express> {
  connectPrismaDb()
  return Promise.resolve(app)
}