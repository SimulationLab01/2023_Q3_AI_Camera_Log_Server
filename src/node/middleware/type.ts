import express from 'express'

export type ExpressMiddleware = readonly [
	path: string, handler: express.RequestHandler
]
