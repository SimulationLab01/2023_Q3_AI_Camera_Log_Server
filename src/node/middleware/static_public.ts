import express from 'express'
import { isDevelopment } from '../constants'

export const static_public = [
	"/public", express.static(`www${isDevelopment ? ".development" : ""}/public`, {
		index: false,
	})
] as const
