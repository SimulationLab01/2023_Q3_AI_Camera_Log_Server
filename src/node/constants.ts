
import * as _pkg from '../../package.json'

export const pkg = _pkg
export const isDevelopment = process.argv.some(x=>x=='--development')
