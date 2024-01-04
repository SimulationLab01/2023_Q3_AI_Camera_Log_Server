import express from 'express'

function skipped_too_long_str(v: any): any{
	if("object" != typeof v){
		const str = String(v)
		return str.length <= 32 ? v : str.slice(0, 32) + `... skipped ${str.length - 64}`
	}
	else {
		return Object.fromEntries(
			Object.entries(v).map(([k, vv]) => {
				return [k, skipped_too_long_str(vv)] as const
			})
		)
	}
}

export const logger = [function (req: express.Request, res: express.Response, next: express.NextFunction) {
		console.log([
			[new Date().toLocaleString(), req.method, req.path],
			skipped_too_long_str(req.body)
		])
		next()
	}
] as const
