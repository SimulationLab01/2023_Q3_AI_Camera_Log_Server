import * as mysql from 'mysql2/promise'
import * as secret from '../../secret.json'
import { Tables } from './infomation_schema'
import dedent from 'dedent'
import { date_to_format1 } from '../utils'


class Database {
	private conn = null as unknown as Awaited<ReturnType<typeof mysql.createConnection>>
	async init() {
		this.conn = await mysql.createConnection(secret['db-connection'])
	}
	close() {
		this.conn?.destroy()
	}
	async select_items<TTable extends keyof Tables, TItems = Tables[TTable][]>(
		table: TTable,
	) {
		const [data, header]: any[] = await this.conn.query(
			`select * from \`${table}\``
		)
		return Array.from(data) as TItems
	}
	async select_items_where_time_in_range<TTable extends keyof Tables, TItems = Tables[TTable] extends { time: string } ? Tables[TTable][] : never>(
		table: TTable,
		from_time?: Date, to_time?: Date
	) {
		const today = ((date)=>{
			date.setHours(0,0,0,0)
			return date
		})(new Date())
		const tomorrow = ((date)=>{
			date.setHours(0,0,0,0)
			date.setDate(date.getDate()+1)
			return date
		})(new Date())
		from_time = from_time || today
		to_time = to_time || tomorrow
		const from_time_str = date_to_format1(from_time || new Date())
		const to_time_str = date_to_format1(to_time || new Date())
		const [data, header]: any[] = await this.conn.query(
			dedent`
			select * from \`${table}\`
			where \`time\` >= ? and \`time\` < ?
			`, [from_time_str, to_time_str] 
		)
		return Array.from(data) as TItems
	}
	async insert_items<
		TTable extends keyof Tables,
		TItem = Tables[TTable],
		TCols extends (keyof TItem)[] = []
	>(
		table: TTable,
		cols: TCols,
		data: Record<(typeof cols)[number], string>[]
	) {
		const cols_str = dedent`(\`${cols.join("`, `")
			}\`)`
		const values_str = data.map(x => `(${cols.map(x => '?').join(', ')})`).join(', ')
		const values = data.flatMap(x => [...cols.map(c => x[c])])
		const cmd = dedent`insert into \`${table}\`
		${cols_str}
		VALUES ${values_str};
		`
		await this.conn.query(cmd, values)
		return
	}
}

export const database = new Database()