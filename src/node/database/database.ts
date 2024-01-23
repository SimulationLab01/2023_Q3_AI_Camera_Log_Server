import * as mysql from 'mysql2/promise'
import secret from '../secret'
import { TableName, TableType, Tables } from '../../shared/infomation_schema'
import dedent from 'dedent'
import { date_to_format1, today, tomorrow } from '../../shared/utils'


class Database {
	// private conn = null as unknown as Awaited<ReturnType<typeof mysql["createConnection"]>>
	private conn = null as unknown as ReturnType<typeof mysql["createPool"]>
	async init() {
		// this.conn = await mysql.createConnection(secret['db-connection'])
		this.conn = mysql.createPool(Object.assign({}, secret['db-connection'], {

		} as mysql.PoolOptions))
	}
	async close() {
		if(this.conn != null){
			await this.conn.end()
		}
	}
	async select_items<TTable extends TableName, TItems = TableType<TTable>[]>(
		table: TTable,
		where?: (readonly [col: keyof TableType<TTable>, op: "=" | "like", val: any, post?: "or" | "and"])[],
		limit?: number
	) {
		const select_str = `select * from \`${table}\``
		const [where_str, where_vals] = this.where_str_vals(where)
		const limit_str = (! limit)? "" : `limit ?`
		const query_str = `${select_str} ${where_str} ${limit_str}`
		const query_vals = [...where_vals, ...((!limit)?[]:[limit])]
		console.log(query_str)
		console.log([...where_vals])
		const [data, header]: [any, any] = await this.conn.query(
			query_str, query_vals
		)
		return Array.from(data) as TItems
	}

	async select_items_where_time_in_range<TTable extends TableName, TItems = TableType<TTable> extends { time: string } ? TableType<TTable>[] : never>(
		table: TTable,
		from_time?: Date, to_time?: Date
	) {
		from_time = from_time || today()
		to_time = to_time || tomorrow()
		const from_time_str = date_to_format1(from_time || new Date())
		const to_time_str = date_to_format1(to_time || new Date())
		const select_str = `select * from \`${table}\``
		const where_str = `where \`time\` >= ? and \`time\` < ?`
		const where_vals = [from_time_str, to_time_str]
		const query_str = `${select_str} ${where_str}`
		const query_vals = [...where_vals]
		console.log(query_str)
		console.log(query_vals)
		const [data, header]: any[] = await this.conn.query(query_str, query_vals)
		return Array.from(data) as TItems
	}

	async insert_items<
		TTable extends TableName,
		TItem = TableType<TTable>,
		TCols extends (keyof TItem)[] = []
	>(
		table: TTable,
		cols: TCols,
		data: Record<(typeof cols)[number], any>[]
	) {
		const insert_str = `insert into \`${table}\``
		const cols_str = dedent`(\`${cols.join("`, `")
			}\`)`
		const values_str = "values " + data.map(x => `(${cols.map(x => '?').join(', ')})`).join(', ')
		const values = data.flatMap(x => [...cols.map(c => x[c])])
		const query_str = `${insert_str} ${cols_str} ${values_str}`
		console.log(query_str)
		const result = (await this.conn.query(query_str, [...values])) as mysql.ResultSetHeader[]
		return result[0].insertId
	}

	async delete_items<
		TTable extends TableName,
	>(
		table: TTable,
		where: (readonly [col: keyof TableType<TTable>, op: "=" | "like", val: any, post?: "or" | "and"])[]
	) {
		if (where.length <= 0) {
			throw Error("Don't delete table without condition.")
		}
		const delete_str = `delete from \`${table}\``
		const where_str = (!where) ? "" : "where " + where.map((unit, idx, arr) => {
			const [col, op, val, post] = unit;
			const col_ = String(col)
			const post_ = (idx == arr.length - 1) ? "" : (post || "and")
			return `\`${col_}\` ${op} ? ${post_}`
		}).join(" ");
		const where_vals = where?.map(x => x[2]) || []
		const query_str = `${delete_str} ${where_str}`
		console.log(query_str)
		console.log([...where_vals])
		const [data, header]: [any, any] = await this.conn.query(
			query_str, [...where_vals]
		)
	}

	async update_items<
		TTable extends TableName
	>(
		table: TTable,
		set: { field: keyof TableType<TTable>, val: any }[],
		where: (readonly [col: keyof TableType<TTable>, op: "=" | "like", val: any, post?: "or" | "and"])[]
	) {
		if (set.length <= 0) {
			throw Error("No changed")
		}
		if (where.length <= 0) {
			throw Error("Don't update table without condition.")
		}
		const update_str = (
			`update \`${table}\` `
		)
		const set_str = "set " + set.map(x => `\`${String(x.field)}\` = ?`).join(", ")
		const set_vals = set.map(x => x.val);
		const [where_str, where_vals] = this.where_str_vals(where)
		const query_str = `${update_str} ${set_str} ${where_str}`
		console.log(query_str)
		const [data, header]: [any, any] = await this.conn.query(
			query_str, [...set_vals, ...where_vals]
		)
	}

	private where_str_vals<
		TTable extends TableName
	>(where?: (readonly [col: keyof TableType<TTable>, op: "=" | "like", val: any, post?: "or" | "and"])[]) {
		return [
			(!where || where.length<=0) ? "" : "where " + where.map((unit, idx, arr) => {
				const [col, op, val, post] = unit;
				const col_ = String(col)
				const post_ = (idx == arr.length - 1) ? "" : (post || "and")
				return `\`${col_}\` ${op} ? ${post_}`
			}).join(" "),
			(!where || where.length<=0) ? [] : where.map(x=>x[2])
		] as const;
	}
}

export const database = new Database()

export function esc(...name: string[]){
	return name.map(x=>`\`${x}\``).join(".")
}

export function str(name: string){
	return `"${name}"`
}