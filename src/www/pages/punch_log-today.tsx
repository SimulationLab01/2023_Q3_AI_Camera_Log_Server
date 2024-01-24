import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { Link, useLoaderData } from 'react-router-dom'
import { date_to_format1 } from '../../shared/utils'
import { fetchapi } from '../utils'
import { TableGrid, TableGridHeader } from './tablegrid'
import { UserNameIdLink } from './utils'

export const PunchLogToday = createRouteComponent({
	path: "punch_log/today",
	loader_handler: () => (async () => {
		return await fetchapi("GET", "/api/punch_log", {})
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const punchlogs = useLoaderData() as TableType<"punch_log_with_photo">[]
	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className="col-12 col-sm-6">
					<h1>
						{T.nav_item.punch_log_today}
					</h1>
					<TableGrid data={punchlogs}>
						<TableGridHeader data-name={(x:any)=>(<>
							{x.location}<br />
							(<Link to={`/device/item/${x.deviceId}`}>{x.deviceId}</Link>)
						</>)}>
							device
						</TableGridHeader>
						<TableGridHeader data-name={UserNameIdLink}>
							user
						</TableGridHeader>
						<TableGridHeader data-name={(x: any)=>date_to_format1(new Date(x.punchTime))}>
							time
						</TableGridHeader>
						<TableGridHeader data-name={(x:any)=>{
							const photo = x.recognitionPhoto as unknown as string
							return photo ? <img src={x.recognitionPhoto} style={{ width: "3em" }} /> : <></>
						}}>
							photo
						</TableGridHeader>
					</TableGrid>
				</div>
			</div>
		</div>
	)
})
