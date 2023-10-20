import FtpClient from 'ftp'
import * as secret from '../../secret.json'
import { punch_log } from '../database/infomation_schema'
import { date_to_format1, date_to_format2 } from '../utils'

export class UploadLogManager {
	private client = null as unknown as FtpClient

	async init() {
		this.client = new FtpClient()
		await this.client_connect_ready(secret['ftp-connection'])
		await this.client_cwd(secret['ftp-working-directory'])
	}
	async upload_overwrite(logs: punch_log[]) {
		const logs_str = logs.map(x=>{
			const date = new Date(x.time)
			const date_str = date_to_format1(date)
			return `${date_str},讀卡機:${x.device_id},員工編號:${x.user_id},`
		}).join("\n") + "\n"
		const logs_filename = `${date_to_format2(new Date())}.txt`
		await this.client_put(logs_str, logs_filename, false)
	}
	async upload(logs: {time: string,device_id: string,user_id: string}[]) {
		const logs_str = logs.map(x=>{
			const date = new Date(x.time)
			const date_str = date_to_format1(date)

			return `${date_str},讀卡機:${x.device_id},員工編號:${x.user_id}`
		}).join("\n") + "\n"
		const logs_filename = `${date_to_format2(new Date())}.txt`
		await this.client_append(logs_str, logs_filename, false)
	}
	async close() {
		await this.client_logout()
		await this.client_destroy()
	}
	private client_connect_ready(options?: FtpClient.Options, verbose=false) {
		return new Promise<void>((res, rej) => {
			this.client.once('ready', () => {
				res(undefined)
			})
			try {
				if(verbose)
					options = Object.assign(options || {}, {debug: console.log})
				this.client.connect(options)
			} catch (error) {
				rej(error)
				return
			}
		})
	}
	private client_cwd(path: string) {
		return new Promise<string | undefined>((res, rej) => {
			this.client.cwd(path, (err, cd) => {
				if (err) { rej(err); return; }
				res(cd)
			})
		})
	}
	private client_list(path: string, useCompression: boolean) {
		return new Promise<FtpClient.ListingElement[]>((res, rej) => {
			this.client.list(path, useCompression, (err, listing) => {
				if (err) { rej(err); return; }
				res(listing)
			});
		})
	}
	private client_put(input: string | Buffer | NodeJS.ReadableStream, destPath: string, useCompression: boolean) {
		return new Promise<void>((res, rej)=>{
			this.client.put(input, destPath, useCompression, (err)=>{
				if (err) { rej(err); return; }
				res(undefined)
			})
		})
	}
	private client_append(input: string | Buffer | NodeJS.ReadableStream, destPath: string, useCompression: boolean) {
		return new Promise<void>((res, rej)=>{
			this.client.append(input, destPath, useCompression, (err)=>{
				if (err) { rej(err); return; }
				res(undefined)
			})
		})
	}
	private client_logout() {
		return new Promise<void>((res, rej)=>{
			this.client.logout((err)=>{
				if (err) { rej(err); return; }
				res(undefined)
			})
		})
	}
	private client_destroy() {
		return new Promise<void>((res, rej)=>{
			try {
				if(this.client){
					this.client.once('close', (err)=>{
						if (err) { rej(err); return; }
						res()
					})
					this.client.destroy()
				}
			} catch (error) {
				rej(error)
			}
		})
	}
	
}