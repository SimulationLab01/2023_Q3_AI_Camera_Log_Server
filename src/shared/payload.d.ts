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

export type PunchLogAddPayload = PunchLogAddPayloadUnit | PunchLogAddPayloadUnit[]

export type PunchLogAddPayloadUnit = {
	user: string,
	time: number,
	device: string
}