import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { DeviceCheckinPayload } from '../../shared/payload'

export const User = createRouteComponent({
	path: "user",
	loader_handler: () => (async () => {
		const res = await fetch("/api/user/with_department")
		const data: TableType<"user_with_department">[] = await res.json()
		return data
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const users = useLoaderData() as TableType<"user_with_department">[]
	const navigate = useNavigate()

	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className="col">
					<h1>
						User
					</h1>
					<div>
						<div className='row'>
							<div className='col-3'>id</div>
							<div className='col-2'>name</div>
							<div className='col-2'>fullname</div>
							<div className='col-5'>department</div>
						</div>
						{...users.map(x => (
							<div className='row'>
								<div className='col-3'>
									<Link to={`/user/item/${x.user_id}`}>{x.user_id}</Link>
								</div>
								<div className='col-2'>{x.name}</div>
								<div className='col-2'>{x.full_name}</div>
								<div className='col-5'>{x.department_id} {x.department_name}</div>
							</div>
						))}
					</div>
				</div>
			</div>


		</div>
	)
})
