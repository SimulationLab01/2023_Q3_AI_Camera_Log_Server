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