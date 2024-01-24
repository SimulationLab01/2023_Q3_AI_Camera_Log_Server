import bodyParser from 'body-parser'
import express from 'express'
import * as http from 'http'
import * as endpoints from './endpoint'
import { favicon, logger, robots, static_public, static_public_res } from './middleware'
import { error } from './middleware/error'


async function main() {
	const startup = express()
	startup.use(...static_public)
	startup.use(...static_public_res)
	startup.use(...favicon)
	startup.use(...robots)
	startup.use(bodyParser.urlencoded({ extended: true }))
	startup.use(bodyParser.json({strict: false}))
	startup.use(...logger)
	Object.entries(endpoints).forEach(([k,v])=>{
		if(Array.isArray(v.args)){
			const args = v.args as [any, any]
			startup[v.method](...args)
		}
	})

	startup.use(...error)

	console.log("Connecting to database")
	const server = http.createServer(startup)
	server.listen(8080, "0.0.0.0")
	console.log("Server listening at http://localhost:8080")

	function handle_signal(signal: number) {
		handle_signal_async(signal)
	}
	async function handle_signal_async(signal: number) {
		console.log()
		console.log("Got signal, closing server")
		server.closeIdleConnections()
		server.closeAllConnections()
		server.close()
	}
	process.on("SIGINT", handle_signal)
	process.on("SIGTERM", handle_signal)
}


if (__filename == require.main?.filename) {
	main()
}
