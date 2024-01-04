import dedent from 'dedent'
import express from 'express'

export const robots = [
	"/robots.txt", function (req: express.Request, res: express.Response) {
		res.type('text/plain')
		res.send(dedent`
			User-agent: *
			Disallow: /
		`)
	}
] as const
