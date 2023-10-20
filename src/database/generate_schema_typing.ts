import * as mysql from 'mysql2/promise'
import * as secret from '../../secret.json'
import * as fs from 'fs'
import * as path from 'path'

const mysql_datatype_map = {
	bigint: "number",
	datetime: "string",
	varchar: "string"
} as const

async function main() {
	const target_database = secret['db-connection'].database;
	const connection_option = Object.assign({}, secret['db-connection'], {
		database: "information_schema"
	})
	const conn = await mysql.createConnection(connection_option)
	const [data, header]: any[] = await conn.query(
		`select * from COLUMNS
         where TABLE_SCHEMA=?
        `, [target_database])
	const tables = new Map<string, [name: string, type: string][]>()

	Array.from(data).forEach((col: any) => {
		console.log([col.TABLE_NAME, col.COLUMN_NAME, col.DATA_TYPE])
		tables.set(col.TABLE_NAME, tables.get(col.TABLE_NAME) || [])
		tables.get(col.TABLE_NAME)!.push([col.COLUMN_NAME, col.DATA_TYPE])
	});
	const file = fs.createWriteStream(path.join(__dirname, "infomation_schema.d.ts"))
	file.write(`export interface Tables {\n`)
	tables.forEach((_, key) => {
		file.write(`\t${key}: ${key}\n`)
	})
	file.write(`}\n`)
	tables.forEach((cols, key) => {
		file.write(`export interface ${key} {\n`)
		cols.forEach(col => {
			const [name, type] = col
			if (type in mysql_datatype_map) {
				const mysql_datatype = type as keyof typeof mysql_datatype_map
				file.write(`\t${name}: ${mysql_datatype_map[mysql_datatype]}\n`)
			}
		})
		file.write(`}\n`)
	})
	file.close()
	// console.log(data)
	conn.destroy()
}

if (__filename == require.main?.filename) {
	main()
}
