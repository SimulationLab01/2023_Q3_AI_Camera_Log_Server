import express from 'express'

export const static_public_res = [
	"/public/img", express.static("res", {
		index: false,
	})
] as const
