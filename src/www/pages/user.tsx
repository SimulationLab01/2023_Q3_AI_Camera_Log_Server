import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import {  useLoaderData, useNavigate } from 'react-router-dom'
import { fetchapi } from '../utils'
import { TableGrid, TableGridHeader } from './tablegrid'
import { UserIdLink } from './utils'

export const User = createRouteComponent({
	path: "user",
	loader_handler: () => (async () => {
		return await fetchapi("/api/user/with_department")
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
					<TableGrid data={users}>
						<TableGridHeader data-name={UserIdLink}>id</TableGridHeader>
						<div data-name="name" >name</div>
						<div data-name="full_name" >fullname</div>
						<div data-name="department_name" >department</div>
					</TableGrid>
				</div>
			</div>
		</div>
	)
})


