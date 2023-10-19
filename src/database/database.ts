import * as mysql from 'mysql2/promise'
import * as secret from '../../secret.json'
import { Tables } from './infomation_schema'
import dedent from 'dedent'


class Database {
	private conn = null as unknown as Awaited<ReturnType<typeof mysql.createConnection>>
	async init() {
		this.conn = await mysql.createConnection(secret.connection)
	}
	close() {
		this.conn?.destroy()
	}
	async select_items<TTable extends keyof Tables, TItems = Tables[TTable][]>(
		table: TTable
	) {
		const [data, header]: any[] = await this.conn.query(
			`select * from \`${table}\``
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
		const cols_str = dedent`(\`${
			cols.join("`, `")
		}\`)`
		const values_str = data.map(x=>`(${cols.map(x=>'?').join(', ')})`).join(', ')
		const values = data.flatMap(x=> [...cols.map(c=>x[c])])
		const cmd = dedent`insert into \`${table}\`
		${cols_str}
		VALUES ${values_str};
		`
		await this.conn.query(cmd, values)
		return
	}
}

export const database = new Database()