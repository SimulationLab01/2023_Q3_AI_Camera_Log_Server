import dedent from "dedent";
import { TableType } from "../../shared/infomation_schema";
import { DeviceCheckinPayload, DeviceRegisterPayload } from "../../shared/payload";
import { database } from "../database";
import { ExpressEndpoint } from "./type";

export const device: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/device",
		async function (req, res, handle_err) {
			try {
				const data = await database.select_items('device')
				res.send(JSON.stringify(data))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const device_item: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/device/item",
		async function (req, res, handle_err) {
			try {
				const device = req.body
				const data = await database.select_items(
					'device',
					[["device_id", '=', device]],
					1
				)
				if (data.length <= 0) {
					res.status(404);
					res.send(JSON.stringify({ message: "not found" }))
				} else {
					res.send(JSON.stringify(data[0]))
				}
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const device_user: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/device/user",
		async function (req, res, handle_err) {
			try {
				const device = req.body
				const data = await database.select_items(
					'device_user_with_name',
					[["device_id", '=', device]]
				)
				res.send(JSON.stringify(data))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const device_checkin: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/device/checkin",
		async function (req, res, handle_err) {
			try {
				const { device, mac_address, current_users } = req.body as DeviceCheckinPayload
				const data = await database.select_items("device", [["device_id", '=', device]])
				if (data.length <= 0) {
					const item: TableType<"device"> = {
						device_id: device,
						mac_address: mac_address,
						state: 0
					}
					await database.insert_items(
						"device",
						["device_id", "mac_address"],
						[item]
					)
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
						const data = await database.select_items(
							"device_user_with_all",
							[["device_id", '=', device.device_id]]
							)
						// const department_ids = (await database.select_items("device_department", [["device_id", '=', device.device_id]])).map(x => x.department_id)
						// const where_department = department_ids.map(x => ['department_id', '=', x, 'or'] as const)
						// const data = await database.select_items(
						// 	"user_with_vaild_photo_feature",
						// 	where_department
						// )
						return res.send(
							JSON.stringify(data.map(x => Object.assign({}, x, {
								photo: x.photo?.toString('base64'),
								feature: x.feature?.toString('base64'),
							})))
						)
					}
				}
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

export const device_register: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/device/register",
		async function (req, res, handle_err) {
			try {
				const { device, location, departments } = req.body as DeviceRegisterPayload
				const available_departments = await database.select_items("department")
				const checked_departments = departments.filter(x => available_departments.some(xx => xx.department_id == x))
				// await database.delete_items(
				// 	"device_department",
				// 	[["device_id", '=', device]]
				// )
				await database.delete_items(
					"device_user",
					[["device_id", '=', device]]
				)
				// if(checked_departments.length > 0){
				// 	await database.insert_items(
				// 		"device_department",
				// 		["device_id", "department_id"],
				// 		checked_departments.map(x => ({
				// 			device_id: device,
				// 			department_id: x
				// 		})))
				// }
				if(checked_departments.length > 0) {
					await database["conn"].query(dedent`
						insert into \`device_user\` (\`device_id\`, \`user_id\`)
						select "${device}", \`u\`.\`user_id\` as \`user_id\` from \`user\` as \`u\`
						where ${
							checked_departments.map(x=>`\`u\`.\`department_id\` = ?`).join(" or ")
						} ;
					`, checked_departments)
				}
				await database.update_items("device", [
					{ field: "location", val: location },
					{ field: "state", val: 1 }
				], [['device_id', '=', device]]);
				res.send(JSON.stringify({ message: "success" }))
			} catch (error) {
				handle_err(error)
			}
		}
	]
}

