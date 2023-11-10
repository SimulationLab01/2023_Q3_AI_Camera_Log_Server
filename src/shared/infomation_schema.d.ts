export interface Tables {
	department: department
	device: device
	device_department: device_department
	punch_log: punch_log
	punch_log_photo: punch_log_photo
	user: user
	user_face_feature_128: user_face_feature_128
	user_photo: user_photo
	user_vaild_photo_feature: user_vaild_photo_feature
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
export interface device_department {
	device_id: string
	department_id: string
}
export interface punch_log {
	punch_log_id?: number
	user_id: string
	device_id: string
	time: string
}
export interface punch_log_photo {
	punch_log_id: number
	photo: Buffer
}
export interface user {
	user_id: string
	name: string
	full_name?: string
	department_id: string
	state?: number
	rfid?: number
}
export interface user_face_feature_128 {
	user_face_feature_128_id?: number
	user_id: string
	feature: Buffer
}
export interface user_photo {
	user_photo_id?: number
	user_id: string
	photo: Buffer
}
export interface user_vaild_photo_feature {
	user_id: string
	name: string
	full_name?: string
	department_id?: string
	department_name?: string
	rfid?: number
	photo?: Buffer
	feature?: Buffer
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
	photo?: Buffer
}
export type TableName = keyof Tables;
export type TableType<TName> = Tables[TName];
