import express from 'express'
import * as http from 'http'
import bodyParser from 'body-parser'
import { database } from './database/database'
import { UploadLogManager } from './upload_log'
import { date_to_format1 } from './utils'

async function main() {
	const startup = express()
	const manager = new UploadLogManager()
	startup.use(bodyParser.urlencoded({ extended: true }))
	startup.use(bodyParser.json())
	startup.use((req, res, next)=>{
		console.log([
			new Date().toLocaleString(),
			req.method, req.path, req.body
		])
		next()
	})
	startup.post("/api/echo", (req, res) => {
		console.log(req.body)
		res.send(JSON.stringify(req.body))
	})

	startup.get("/api/punch_logs", async (req, res, handle_err) => {
		try {
			const data = await database.select_items('punch_log')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})

	startup.post("/api/punch_logs/add", async (req, res, handle_err) => {
		try {
			function resolve_single_added_data(post_data: any){
				const { time, user, device } = post_data
				const date = time ? new Date(time) : new Date()
				const date_str = date_to_format1(date)	
				return {
					time: date_str,
					user_id: String(user),
					device_id: String(device)
				}
			}
			
			const added_data: ReturnType<typeof resolve_single_added_data>[] = []
			if(Array.isArray(req.body)){
				added_data.push(...Array.from(req.body).map((x)=>{
					return resolve_single_added_data(x)
				}))
			}else{
				added_data.push(resolve_single_added_data(req.body))
			}

			await database.insert_items('punch_log',
				['time', 'user_id', 'device_id'], added_data)
			await manager.upload(added_data)
			res.send(JSON.stringify({ message: "success" }))
		} catch (error) {
			handle_err(error)
		}
	})

	startup.post("/api/punch_logs/upload", async (req, res, handle_err) => {
		const data = await database.select_items('punch_log')
		manager.upload(data)
		res.send(JSON.stringify({ message: "success" }))
	})

	startup.use(((err, req, res, next) => {
		if (req.path.startsWith('/api')) {
			res.status(500)
			res.send({
				message: "Internal Server Error",
				err
			})
		}
		next(err)
	}) as express.ErrorRequestHandler)


	console.log("Connecting to database")
	await database.init()
	await manager.init()
	const server = http.createServer(startup)
	server.listen(8080, "0.0.0.0")
	console.log("Server listening at http://localhost:8080")
	function handle(signal: number) {
		console.log()
		console.log("Got signal, closing server")
		server.closeIdleConnections()
		server.closeAllConnections()
		server.close()
		console.log("Closing database")
		database.close()
		manager.close()
	}
	process.on("SIGINT", handle)
	process.on("SIGTERM", handle)

}


if (__filename == require.main?.filename) {
	main()
}
