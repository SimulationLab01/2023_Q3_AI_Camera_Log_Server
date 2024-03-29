import React, { useCallback } from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { useLoaderData, useNavigate } from 'react-router-dom'
import type { DeviceRegisterPayload } from '../../shared/payload'
import { fetchapi } from '../utils'
import { TableGrid } from './tablegrid'
import { HorizontalItemGrid, ItemGridHeader } from './itemgrid'
import { DeviceState, DeviceUsers } from './utils'

type LoaderDataType = readonly [
	any,
	any[],
	any[]
]

export const DeviceItem = createRouteComponent({
	path: "device/item/:device",
	loader_handler: () => (async (args) => {
		const devices:any[] = await fetchapi("GET",
			"/api/device"
		)
		const item = devices.find(x=>x.deviceId == args.params.device)
		console.log(item)
		const item_users:string[] = item.users
		const department:any[] = (await fetchapi("GET","/api/department"))
		const users:any[] = (await fetchapi("GET","/api/user"))
		return [
			item, item_users.map(x=>users.filter(xx=>xx.userId==x)[0]), department
		]
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const navigate = useNavigate()
	const [device, device_users, all_departments] = (
		useLoaderData() as LoaderDataType
	)
	const handle_submit = async (ev: React.FormEvent) => {
		ev.preventDefault()
		const form = ev.target as HTMLFormElement
		const data = new FormData(form)
		const location = data.get("location")
		const checks = Array.from(data.keys())
			.filter(x => {
				console.log([x, x.startsWith('check-department-')])
				return x.startsWith('check-department-')
			})
			.map(x => x.replace('check-department-', ''))
		console.log(location)
		console.log(checks)
		const payload = {
			deviceId: device.deviceId,
			location: location?.toString() || "",
			users: []
		}
		await fetchapi("POST", "/api/device/register", payload)
		navigate(0)
	}
	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className='col-6'>
					<h1>
						Device
					</h1>
					<HorizontalItemGrid item={device}>
						<div className='text-end label-colon' data-name="deviceId">id</div>
						<div className='text-end label-colon' data-name="macAddress">mac_address</div>
						<div className='text-end label-colon' data-name="location">location</div>
						<ItemGridHeader className='text-end label-colon'
							data-name={DeviceState}>
							state
						</ItemGridHeader>
						<ItemGridHeader className='text-end label-colon'
							data-name={()=>(<DeviceUsers {...{device_users}}/>)}>
							users
						</ItemGridHeader>
					</HorizontalItemGrid>
				</div>
				<div className='col-6'>
					<h1>Register</h1>
					<form onSubmit={handle_submit}>
						<input type="submit" className="form-control btn btn-primary" id="normal-submit" />
						<div className="form-floating mt-3 mb-3">
							<input type="text" className="form-control" id="floating-location" placeholder="" name="location" defaultValue={device.location} />
							<label htmlFor="floating-location">Location</label>
						</div>
						{
							...all_departments.map(x => (
								<div className="form-check">
									<input className="form-check-input" type="checkbox" value="" id={`check-department-${x.department_id}`} name={`check-department-${x.department_id}`} defaultChecked={true} />
									<label className="form-check-label" htmlFor={`check-department-${x.department_id}`}>
										{x.department_id} {x.name}
									</label>
								</div>
							))
						}
					</form>
				</div>
			</div>
		</div>
	)
})

