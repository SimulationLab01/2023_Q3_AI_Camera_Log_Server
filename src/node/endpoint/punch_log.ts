import { TableType } from "../../shared/infomation_schema";
import { PunchLogAddPayload, PunchLogPayload } from "../../shared/payload";
import { MIN_MYSQL_TIME, MAX_MYSQL_TIME, date_to_format1 } from "../../shared/utils";
import { database } from "../database";
import { ERROR_POST_DATA_INVALID } from "../middleware/error";
import { ExpressEndpoint } from "./type";

export const punch_log: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/punch_log",
		async function (req, res, handle_err) {
			try {
				const { from, to } = req.body as PunchLogPayload
				const from_time = new Date(from || MIN_MYSQL_TIME)
				const to_time = new Date(to || MAX_MYSQL_TIME)
				const data = await database.select_items_where_time_in_range(
					'punch_log_with_photo',
					from_time,
					to_time
				)
				res.send(JSON.stringify(data.map(x => Object.assign({}, x, {
					photo: x.photo?.toString('base64')
				}))))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const punch_log_today: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/punch_log/today",
		async function (req, res, handle_err) {
			try {
				const data = await database.select_items_where_time_in_range(
					'punch_log_with_photo'
				)
				res.send(JSON.stringify(data.map(x => Object.assign({}, x, {
					photo: x.photo?.toString('base64')
				}))))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const punch_log_list: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/punch_log/list",
		async function (req, res, handle_err) {
			try {
				const data = await database.select_items('punch_log_with_photo')
				res.send(JSON.stringify(data.map(x => Object.assign({}, x, {
					photo: x.photo?.toString('base64')
				}))))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const punch_log_add: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/punch_log/add",
		async function (req, res, handle_err) {
			try {
				const { time, user, device, base64Image } = req.body as PunchLogAddPayload
				if (!time && !user && !device) {
					throw ERROR_POST_DATA_INVALID
				}
				const date = time ? new Date(time) : new Date()
				const date_str = date_to_format1(date)
				const punch_log: TableType<"punch_log"> = {
					time: date_str,
					user_id: String(user),
					device_id: String(device)
				}
				const last_inserted_id = await database.insert_items(
					'punch_log', ['time', 'user_id', 'device_id'], [punch_log])
				if (base64Image) {
					const punch_log_photo: TableType<"punch_log_photo"> = {
						punch_log_id: last_inserted_id,
						photo: Buffer.from(base64Image, 'base64')
					}
					await database.insert_items(
						'punch_log_photo', ['punch_log_id', 'photo'], [punch_log_photo])
				}
				res.send(JSON.stringify({ message: "success" }))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}
