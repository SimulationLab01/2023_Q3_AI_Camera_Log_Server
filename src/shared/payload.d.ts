import { type } from "os"

export type DeviceCheckinPayload = {
	device: string,
	mac_address: string,
	current_users?: string[]
}

export type DeviceRegisterPayload = {
	device: string,
	location: string,
	departments: string[]
}

export type DeviceItemPayload = string

export type UserItemPayload = string

export type UserFaceFeaturePayload = string

export type PunchLogAddPayload = {
	user: string,
	time: number,
	device: string,
	base64Image: string
}

export type PunchLogPayload = {
	from: number,
	to: number
}