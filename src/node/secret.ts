import * as secret_json from "../../secret.json"
import type * as mysql from 'mysql2/promise'
import type * as ftp from 'ftp'

export default secret_json as {
	"db-connection": mysql.ConnectionOptions,
	"ftp"?: {
		"connection": ftp.Options,
		"working-directory": string
	}
}
