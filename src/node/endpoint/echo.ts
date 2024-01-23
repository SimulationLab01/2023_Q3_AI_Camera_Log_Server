import { ExpressEndpoint } from "./type";

export const echo: ExpressEndpoint = {
	method: "post",
	args: [
		"/api/echo",
		async function (req, res, handle_err) {
			try {
				console.log(req.body)
				res.send(JSON.stringify(req.body))
			} catch (error) {
				handle_err(error)
			}
		}]
}
