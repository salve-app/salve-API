import { init } from '@/app'

const PORT = process.env.PORT || 5000

init().then((app) => {
	app.listen(PORT, () => console.log(`Server is listening in PORT: ${PORT}`))
})
