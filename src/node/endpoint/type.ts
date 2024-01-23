import express from 'express'

export type ExpressEndpoint ={
	method: "post" | "get",
	args: (
		readonly [
			path: string, handler: express.RequestHandler
		]
	)
}
