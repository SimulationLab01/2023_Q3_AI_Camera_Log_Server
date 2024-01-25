import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { DeviceCheckinPayload } from '../../shared/payload'
import { fetchapi } from '../utils'
import { TableGrid, TableGridHeader } from './tablegrid'
import { DeviceIdLink, DeviceState, Div } from './utils'

export const Device = createRouteComponent({
	path: "device",
	loader_handler: () => (async () => {
		return await fetchapi("GET", "/api/device")
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const devices = useLoaderData() as TableType<"device">[]
	const navigate = useNavigate()
	const handle_submit = async (ev: React.FormEvent) => {
		ev.preventDefault()
		const form = ev.target as HTMLFormElement
		const data = new FormData(form)
		const device_id = data.get("device_id")?.toString()
		const mac_address = data.get("mac_address")?.toString()
		if (device_id && mac_address) {
			const payload = {
				deviceId: device_id,
				macAddress: mac_address
			}
			const data = await fetchapi("POST", "/api/device/checkin", payload)
			console.log(data)
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
					<TableGrid data={devices}>
						<Div data-name={DeviceIdLink}>
							id
						</Div>
						<div data-name="macAddress">mac_address</div>
						<div data-name="location">location</div>
						<TableGridHeader data-name={DeviceState}>
							state
						</TableGridHeader>
					</TableGrid>
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
							<input type="text" className="form-control" id="floating-device_id" placeholder="" name="device_id" />
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
