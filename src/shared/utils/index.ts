/**
 * format date
 * @param date date
 * @returns "yyyy:mm:dd HH:MM:SS"
 */
export function date_to_format1(date: Date){
	const mm = (date.getMonth() + 1).toString().padStart(2, '0')
	const dd = date.getDate().toString().padStart(2, '0')
	const yyyy = date.getFullYear()
	const HH = date.getHours().toString().padStart(2, '0')
	const MM = date.getMinutes().toString().padStart(2, '0')
	const SS = date.getSeconds().toString().padStart(2, '0')
	return `${yyyy}/${mm}/${dd} ${HH}:${MM}:${SS}`;
}

/**
 * format date
 * @param date date
 * @returns "mmddyyyy"
 */
export function date_to_format2(date: Date){
	const mm = (date.getMonth() + 1).toString().padStart(2, '0')
	const dd = date.getDate().toString().padStart(2, '0')
	const yyyy = date.getFullYear()
	return `${mm}${dd}${yyyy}`
}

/**
 * format date
 * @param date date
 * @returns "yyyy-mm-dd"
 */
export function date_to_format3(date: Date){
	const mm = (date.getMonth() + 1).toString().padStart(2, '0')
	const dd = date.getDate().toString().padStart(2, '0')
	const yyyy = date.getFullYear()
	return `${yyyy}-${mm}-${dd}`
}

export function today(){
	const today = ((date) => {
		date.setHours(0, 0, 0, 0)
		return date
	})(new Date())
	return today
}

export function tomorrow() {
	const tomorrow = ((date) => {
		date.setHours(0, 0, 0, 0)
		date.setDate(date.getDate() + 1)
		return date
	})(new Date())
	return tomorrow
}

export const MIN_MYSQL_TIME = -30578717160000;
export const MAX_MYSQL_TIME = 253402185600000
export function min_mysql_date() {
	return new Date(MIN_MYSQL_TIME)
}
export function max_mysql_date() {
	return new Date(MAX_MYSQL_TIME)
}