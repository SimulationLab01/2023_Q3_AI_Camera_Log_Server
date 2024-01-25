import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { useDocumentTitle } from 'usehooks-ts'
import type { TableType } from '../../shared/infomation_schema'
import { useTranslation } from '../translation'
import { fetchapi } from '../utils'
import { createRouteComponent } from './route-component'

type LoaderDataType = readonly [
	any,
	any[]
]
export const UserItem = createRouteComponent({
	path: "user/item/:user",
	loader_handler: () => (async (args) => {
		const departments = await fetchapi<any[]>("GET", "/api/department");
		const user = await fetchapi("GET", "/api/user/with_photo/item", {userId: args.params.user});
		Object.assign(user, {departmentName: departments.find(x=>x.departmentId == user.departmentId).name})
		return [user, []] as const
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const [user, photos] = (
		useLoaderData() as LoaderDataType
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
						<div className='col-6'>{user.userId}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>name</div>
						<div className='col-6'>{user.name}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>full name</div>
						<div className='col-6'>{user.fullName}</div>
					</div>
					<div className='row'>
						<div className='col-4 text-end label-colon'>department</div>
						<div className='col-6'>{user.departmentId} {user.departmentName}</div>
					</div>
					{/* <div className='row'>
						<div className='col-4 text-end label-colon'>features</div>
					</div>
					{
							...(features.map(x=>{
								return <div className='row'>
									<div className='col-4 text-end'></div>
									<div className='col-6 overflow-hidden'>{x.feature}</div>
								</div>
							}))
						}
					 */}
				</div>
				<div className='col-6'>
					{
						user.photos.map((x:any)=>(
							<img src={x} style={{ width: "100%" }} />
						))
					}
				</div>
			</div>
		</div>
	)
})
