import { join as joinpath } from 'path'
import { isDevelopment } from '../constants'
import { ExpressEndpoint } from './type'

export * from './echo'

export const index: ExpressEndpoint = {
	method: 'get',
	args: [
		"*",
		async function (req, res, handle_err) {
			try {
				const index_html_path = joinpath(process.cwd(), `www${isDevelopment ? ".development" : ""}`, 'app.html')
				res.sendFile(index_html_path)
			} catch (error) {
				handle_err(error)
			}
		}
	]
}
