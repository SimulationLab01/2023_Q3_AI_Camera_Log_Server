export interface Tables {
	department: department
	device: device
	device_user: device_user
	device_user_with_all: device_user_with_all
	device_user_with_name: device_user_with_name
	punch_log: punch_log
	punch_log_photo: punch_log_photo
	punch_log_with_photo: punch_log_with_photo
	user: user
	user_face_feature_128: user_face_feature_128
	user_photo: user_photo
	user_with_department: user_with_department
	user_with_photo: user_with_photo
}
export interface department {
	department_id: string
	name: string
}
export interface device {
	device_id: string
	mac_address: string
	location?: string
	state?: number
}
export interface device_user {
	device_user_id?: number
	device_id: string
	user_id: string
}
export interface device_user_with_all {
	device_id: string
	user_id: string
	name?: string
	full_name?: string
	title?: string
	state?: number
	photo?: Buffer | string
	feature?: Buffer | string
}
export interface device_user_with_name {
	device_id: string
	user_id: string
	name?: string
	full_name?: string
}
export interface punch_log {
	punch_log_id?: number
	user_id: string
	device_id: string
	time: string
}
export interface punch_log_photo {
	punch_log_id: number
	photo: Buffer | string
}
export interface punch_log_with_photo {
	punch_log_id?: number
	user_id: string
	name?: string
	device_id: string
	location?: string
	time: string
	photo?: Buffer | string
}
export interface user {
	user_id: string
	name: string
	full_name?: string
	title?: string
	department_id: string
	state?: number
	rfid?: number
}
export interface user_face_feature_128 {
	user_face_feature_128_id?: number
	user_id: string
	feature: Buffer | string
}
export interface user_photo {
	user_photo_id?: number
	user_id: string
	photo: Buffer | string
}
export interface user_with_department {
	user_id: string
	name: string
	full_name?: string
	department_id?: string
	department_name?: string
	rfid?: number
}
export interface user_with_photo {
	user_id: string
	name: string
	full_name?: string
	department_id?: string
	department_name?: string
	rfid?: number
	photo?: Buffer | string
}
export type TableName = keyof Tables;
export type TableType<TName> = Tables[TName];
