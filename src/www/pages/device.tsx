import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { DeviceCheckinPayload } from '../../shared/payload'

export const Device = createRouteComponent({
	path: "device",
	loader_handler: () => (async () => {
		const res = await fetch("/api/device")
		const data: TableType<"device">[] = await res.json()
		return data
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const devices = useLoaderData() as TableType<"device">[]
	const navigate = useNavigate()
	const handle_submit = async(ev: React.FormEvent)=>{
		ev.preventDefault()
		const form = ev.target as HTMLFormElement
		const data = new FormData(form)
		const device_id = data.get("device_id")?.toString()
		const mac_address = data.get("mac_address")?.toString()
		if (device_id && mac_address){
			const payload: DeviceCheckinPayload = {
				device: device_id,
				mac_address: mac_address
			}
			const res = await fetch("/api/device/checkin", {
				method: "POST",
				body: JSON.stringify(payload),
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				}
			})
			if(!res.ok){
				console.error(await res.json())
			}
			navigate(0)
		}
	}
	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className="col-8">
					<h1>
						Device
					</h1>
					<div>
						<div className='row'>
							<div className='col-4'>id</div>
							<div className='col-4'>mac_address</div>
							<div className='col-2'>location</div>
							<div className='col-2'>state</div>
						</div>
						{...devices.map(x => (
							<div className='row'>
								<div className='col-4'>
									<Link to={`/device/item/${x.device_id}`}>{x.device_id}</Link>
								</div>
								<div className='col-4'>{x.mac_address}</div>
								<div className='col-2'>{x.location}</div>
								<div className='col-2'>{x.state == 1 ? "已註冊" : "未註冊"}</div>
							</div>
						))}
					</div>
				</div>
				<div className='col-4'>
					<div className='row'>
						<h1>Check in</h1>
					</div>
					<form onSubmit={handle_submit}>
						<div className='mb-3'>
							<input type="submit" className="form-control btn btn-primary" id="normal-submit" />
						</div>
						<div className="mb-3 form-floating">
							<input type="text" className="form-control" id="floating-device_id" placeholder="" name="device_id"/>
							<label htmlFor="floating-device_id">device id</label>
						</div>
						<div className="mb-3 form-floating">
							<input type="text" className="form-control" id="floating-mac_address" placeholder="" name="mac_address" />
							<label htmlFor="floating-mac_address">mac address</label>
						</div>
					</form>
				</div>
			</div>


		</div>
	)
})
