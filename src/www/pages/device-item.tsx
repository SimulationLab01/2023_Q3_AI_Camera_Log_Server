import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { useLoaderData, useNavigate } from 'react-router-dom'
import type { DeviceRegisterPayload } from '../../shared/payload'

export const DeviceItem = createRouteComponent({
	path: "device/item/:device",
	loader_handler: () => (async (args) => {
		const device = await ((async () => {
			const res = await fetch("/api/device/item", {
				method: "POST",
				body: JSON.stringify(args.params.device),
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				}
			})
			if (!res.ok) {
				throw Error(await res.json())
			}
			return (await res.json()) as TableType<"device">
		})())
		const device_departments = await ((async () => {
			const res = await fetch("/api/device/department", {
				method: "POST",
				body: JSON.stringify(args.params.device),
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				}
			})
			if (!res.ok) {
				throw Error(await res.json())
			}
			return (await res.json()) as TableType<"device_department">
		})())
		const all_departments = await ((async () => {
			const res = await fetch("/api/department", {
				method: "GET",
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				}
			})
			if (!res.ok) {
				throw Error(await res.json())
			}
			return (await res.json()) as TableType<"department">
		})())

		return [device, device_departments, all_departments]
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const navigate = useNavigate()
	const [device, device_departments, all_departments] = (
		useLoaderData() as [
			TableType<"device">,
			TableType<"device_department">[],
			TableType<"department">[]]
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
		const payload: DeviceRegisterPayload = {
			device: device.device_id,
			location: location?.toString() || "",
			departments: checks
		}
		const res = await fetch("/api/device/register", {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"content-type": "application/json",
				"accept": "application/json"
			}
		})
		if(res.ok){
			navigate(0)
		}else{
			console.error(await res.json())
		}
	}
	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className='col-6'>
					<h1>
						Device
					</h1>
					<div className='row'>
						<div className='col-4 text-end label-colon'>id</div>
						<div className='col-6'>{device.device_id}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>mac_address</div>
						<div className='col-6'>{device.mac_address}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>location</div>
						<div className='col-6'>{device.location}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>state</div>
						<div className='col-6'>{device.state == 1 ? "已註冊" : "未註冊"}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>department</div>
					</div>
					{
						...all_departments
							.filter(x => device_departments.some(xx => xx.department_id == x.department_id))
							.map(x => (
								<div className='row'>
									<div className='col-4'></div>
									<div className='col-6'>{x.department_id} {x.name}</div>
								</div>
							))
					}
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
									<input className="form-check-input" type="checkbox" value="" id={`check-department-${x.department_id}`} name={`check-department-${x.department_id}`} defaultChecked={device_departments.some(xx => xx.department_id == x.department_id) ? true : undefined} />
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
