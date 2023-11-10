import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { useLoaderData, useNavigate } from 'react-router-dom'
import type { DeviceRegisterPayload } from '../../shared/payload'

export const UserItem = createRouteComponent({
	path: "user/item/:user",
	loader_handler: () => (async (args) => {
		const user = await ((async () => {
			const res = await fetch("/api/user/with_photo/item", {
				method: "POST",
				body: JSON.stringify(args.params.user),
				headers: {
					"content-type": "application/json",
					"accept": "application/json"
				}
			})
			if (!res.ok) {
				throw Error(await res.json())
			}
			return (await res.json()) as TableType<"user_with_photo">
		})())

		return user
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const navigate = useNavigate()
	const user = (
		useLoaderData() as TableType<"user_with_photo">
	)

	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className='col-6'>
					<h1>
						User
					</h1>
					<div className='row'>
						<div className='col-4 text-end label-colon'>id</div>
						<div className='col-6'>{user.user_id}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>mac_address</div>
						<div className='col-6'>{user.name}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>location</div>
						<div className='col-6'>{user.full_name}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>department</div>
						<div className='col-6'>{user.department_id} {user.department_name}</div>
					</div>
				</div>
				<div className='col-6'>
					<img src={`data:image/jpg;base64,${user.photo}`} style={{width: "100%"}} />
				</div>
			</div>
		</div>
	)
})
