import { database } from "../database";
import { ExpressEndpoint } from "./type";

export const department: ExpressEndpoint = {
	method: "post",
	args: [
		"/api/department",
		async function (req, res, handle_err) {
			try {
				const data = await database.select_items('department')
				res.send(JSON.stringify(data))
			} catch (error) {
				handle_err(error)
			}
		}]
}
