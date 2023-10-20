export interface Tables {
	punch_log: punch_log
}
export interface punch_log {
	id: number
	time: string
	device_id: string
	user_id: string
}
