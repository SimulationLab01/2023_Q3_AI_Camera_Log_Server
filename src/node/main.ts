import express from 'express'
import * as http from 'http'
import bodyParser from 'body-parser'
import { database } from './database/database'
import { UploadLogManager } from './upload_log'
import { date_to_format1 } from './utils'
import { setInterval } from 'timers'
import secret from './secret'
import path from 'path'
import { isDevelopment } from './constants'
import dedent from 'dedent'
import { DeviceCheckinPayload, DeviceRegisterPayload, PunchLogAddPayloadUnit, UserItemPayload } from '../shared/payload'
import { TableType } from '../shared/infomation_schema'

const ERROR_POST_DATA_INVALID = "post data invalid"

async function main() {
	const startup = express()
	// const manager = new UploadLogManager()
	startup.use("/public", express.static(`www${isDevelopment ? ".development" : ""}/public`, {
		index: false,
	}))
	startup.use("/public/img", express.static("img", {
		index: false,
	}))
	startup.use("/favicon.ico", (req, res) => {
		res.sendStatus(404);
	})
	startup.use("/robots.txt", (req, res) => {
		res.type('text/plain')
		res.send(dedent`
			User-agent: *
			Disallow: /
		`)
	})
	startup.use(bodyParser.urlencoded({ extended: true }))
	startup.use(bodyParser.json({strict: false}))
	startup.use((req, res, next) => {
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
	startup.get("/api/user", async (req, res, handle_err) => {
		try {
			const data = await database.select_items('user')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.post("/api/user/with_photo/item", async (req, res, handle_err) => {
		try {
			const user = req.body as UserItemPayload
			const data = await database.select_items('user_with_photo', [['user_id', '=', user]], 1)
			console.log(user)
			if(data.length <= 0){
				res.status(404);
				res.send(JSON.stringify({ message: "not found" }))
			}else{
				res.send(JSON.stringify(Object.assign({}, data[0], {
					photo: data[0].photo?.toString('base64')
				})))
			}
		} catch (error) {
			handle_err(error)
		}
	})
	startup.get("/api/user/with_department", async (req, res, handle_err) => {
		try {
			const data = await database.select_items('user_with_department')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.get("/api/department", async (req, res, handle_err) => {
		try {
			const data = await database.select_items('department')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.get("/api/device", async (req, res, handle_err) => {
		try {
			const data = await database.select_items('device')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.post("/api/device/item", async (req, res, handle_err) => {
		try {
			const device = req.body
			const data = await database.select_items('device', [["device_id", '=', device]], 1)
			
			if(data.length <= 0){
				res.status(404);
				res.send(JSON.stringify({ message: "not found" }))
			}else{
				res.send(JSON.stringify(data[0]))
			}
		} catch (error) {
			handle_err(error)
		}
	})
	startup.post("/api/device/department", async (req, res, handle_err) => {
		try {
			const device = req.body
			const data = await database.select_items('device_department', [["device_id", '=', device]])
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.post("/api/device/checkin", async (req, res, handle_err) => {
		try {
			const { device, mac_address, current_users } = req.body as DeviceCheckinPayload
			const data = await database.select_items("device", [["device_id", '=', device]])
			if (data.length <= 0) {
				const item: TableType<"device"> = {
					device_id: device,
					mac_address: mac_address,
					state: 0
				}
				await database.insert_items("device", ["device_id", "mac_address"], [item])
				res.status(404);
				res.send(JSON.stringify({ message: "not registed" }))
				return
			}
			else {
				const device = data[0]
				if ((device.state || 0) != 1) {
					res.status(404);
					res.send(JSON.stringify({ message: "not registed" }))
					return
				}
				else {
					const department_ids = (await database.select_items("device_department", [["device_id", '=', device.device_id]])).map(x => x.department_id)
					const where_department = department_ids.map(x => ['department_id', '=', x, 'or'] as const)
					const data = await database.select_items("user_vaild_photo_feature", where_department)
					return res.send(JSON.stringify(data))
				}
			}
		} catch (error) {
			handle_err(error)
		}
	})
	startup.post("/api/device/register", async (req, res, handle_err) => {
		try {
			const { device, location, departments } = req.body as DeviceRegisterPayload
			const available_departments = await database.select_items("department")
			const checked_departments = departments.filter(x => available_departments.some(xx => xx.department_id == x))
			if (checked_departments.length) {
				await database.delete_items("device_department", [["device_id", '=', device]])
				await database.insert_items("device_department", ["device_id", "department_id"], checked_departments.map(x => ({
					device_id: device,
					department_id: x
				})))
				await database.update_items("device", [
					{ field: "location", val: location },
					{ field: "state", val: 1 }
				], [['device_id', '=', device]]);
			} else {
				res.status(404);
				res.send(JSON.stringify({ message: "contains unavailabled departments" }))
			}
			res.send(JSON.stringify({ message: "success" }))
		} catch (error) {
			handle_err(error)
		}

	})
	startup.get("/api/punch_log", async (req, res, handle_err) => {
		try {
			const data = await database.select_items_where_time_in_range('punch_log')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.get("/api/punch_log/list", async (req, res, handle_err) => {
		try {
			const data = await database.select_items('punch_log')
			res.send(JSON.stringify(data))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.post("/api/punch_log/add", async (req, res, handle_err) => {
		try {
			function resolve_payload_unit(payload: PunchLogAddPayloadUnit): TableType<"punch_log"> {
				const { time, user, device } = payload
				if (!time && !user && !device) {
					throw ERROR_POST_DATA_INVALID
				}
				const date = time ? new Date(time) : new Date()
				const date_str = date_to_format1(date)
				return {
					time: date_str,
					user_id: String(user),
					device_id: String(device)
				}
			}
			const added_data: ReturnType<typeof resolve_payload_unit>[] = []
			if (Array.isArray(req.body)) {
				added_data.push(...Array.from(req.body).map((x) => {
					return resolve_payload_unit(x)
				}))
			} else {
				added_data.push(resolve_payload_unit(req.body))
			}
			await database.insert_items('punch_log',
				['time', 'user_id', 'device_id'], added_data)
			res.send(JSON.stringify({ message: "success" }))
		} catch (error) {
			handle_err(error)
		}
	})
	startup.get("*", (req, res) => {
		const index_html_path = path.join(process.cwd(), `www${isDevelopment ? ".development" : ""}`, 'app.html')
		res.sendFile(index_html_path)
	})
	startup.use(((err, req, res, next) => {
		if (req.path.startsWith('/api')) {
			if (err == ERROR_POST_DATA_INVALID) {
				res.status(400)
				res.send({
					message: "Bad Request",
					err
				})
			} else {
				res.status(500)
				res.send({
					message: "Internal Server Error",
					err
				})
			}
		}
		next(err)
	}) as express.ErrorRequestHandler)

	console.log("Connecting to database")
	await database.init()
	const server = http.createServer(startup)
	server.listen(8080, "localhost")
	console.log("Server listening at http://localhost:8080")
	const interval_upload_to_ftp = (secret.ftp || false) && setInterval(async () => {
		const data = await database.select_items_where_time_in_range('punch_log')
		const manager = new UploadLogManager()
		await manager.init()
		await manager.upload_overwrite(data);
		manager.close()
	}, 15 * 60 * 1000);

	function handle(signal: number) {
		console.log()
		console.log("Got signal, closing server")
		server.closeIdleConnections()
		server.closeAllConnections()
		server.close()
		console.log("Closing database")
		database.close()
		if (interval_upload_to_ftp) {
			clearInterval(interval_upload_to_ftp);
		}
		// manager.close()
	}
	process.on("SIGINT", handle)
	process.on("SIGTERM", handle)
}


if (__filename == require.main?.filename) {
	main()
}
