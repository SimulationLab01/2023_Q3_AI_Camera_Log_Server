import express from 'express'

export const ERROR_POST_DATA_INVALID = "post data invalid"

export const error = [
	function (err: any, req: express.Request, res: express.Response, next: express.NextFunction){
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
	}
] as const
