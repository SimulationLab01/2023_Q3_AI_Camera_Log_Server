import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { useDocumentTitle } from 'usehooks-ts'
import type { TableType } from '../../shared/infomation_schema'
import { useTranslation } from '../translation'
import { fetchapi } from '../utils'
import { createRouteComponent } from './route-component'

type LoaderDataType = readonly [
	TableType<"user_with_photo">,
	TableType<"user_face_feature_128">[]
]
export const UserItem = createRouteComponent({
	path: "user/item/:user",
	loader_handler: () => (async (args) => {
		const user = await fetchapi("GET", "/api/user", args.params.user);
		const features = await fetchapi("GET", "/api/user/face_feature", args.params.user); 
		return [user, features] as const
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const [user, features] = (
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
					<div className='row'>
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
					
				</div>
				<div className='col-6'>
					{!user.photo ? <></> : <img src={`data:image/jpg;base64,${user.photo}`} style={{ width: "100%" }} />}
				</div>
			</div>
		</div>
	)
})
