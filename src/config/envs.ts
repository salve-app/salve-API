import dotenv from 'dotenv'
import dExpand from 'dotenv-expand'

export default function loadEnv() {
	const { NODE_ENV } = process.env

	const path = NODE_ENV ? `.env.${NODE_ENV}` : '.env'

	dExpand.expand(dotenv.config({ path }))
}
