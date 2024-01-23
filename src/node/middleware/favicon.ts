import express from 'express'

export const favicon = [
	"/favicon.ico", function (req: express.Request, res: express.Response) {
		res.sendStatus(404);
	}
] as const
