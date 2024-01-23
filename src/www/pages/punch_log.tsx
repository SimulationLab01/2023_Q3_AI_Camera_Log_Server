import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'
import type { TableType } from '../../shared/infomation_schema'
import { Link, useLoaderData, useSearchParams } from 'react-router-dom'
import { MAX_MYSQL_TIME, MIN_MYSQL_TIME, date_to_format1, date_to_format2, date_to_format3, today, tomorrow } from '../../shared/utils'
import { fetchapi } from '../utils'
import { TableGrid, TableGridHeader } from './tablegrid'
import {UserNameIdLink} from './utils'

export const PunchLog = createRouteComponent({
	path: "punch_log",
	loader_handler: () => (async (args) => {
		const params = Object.fromEntries(new window.URLSearchParams(args.request.url.split('?', 2)[1]).entries())
		const from = parseInt(params.from || MIN_MYSQL_TIME.toString())
		const to = parseInt(params.to || MAX_MYSQL_TIME.toString())
		const data = await fetchapi("/api/punch_log", { from, to })
		return data
	})
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	const punchlogs = useLoaderData() as TableType<"punch_log_with_photo">[]
	const [searchParams, setSearchParams] = useSearchParams()
	const params = Object.fromEntries(searchParams.entries())
	const from = new Date(parseInt(params.from || MIN_MYSQL_TIME.toString()))
	const to = new Date(parseInt(params.to || MAX_MYSQL_TIME.toString()))
	function handle_submit(ev: React.FormEvent) {
		ev.preventDefault()
		const form_data = new FormData(ev.target as HTMLFormElement)
		const newSearchParams = {
			from: new Date(form_data.get("from")!.toString()).getTime().toString(),
			to: new Date(form_data.get("to")!.toString()).getTime().toString()
		}
		setSearchParams(newSearchParams)
	}
	return (
		<div className='container'>
			<div className='row mt-5'>
				<div className="col-12 col-sm-6">
					<h1>
						{T.nav_item.punch_log}
					</h1>
					<form onSubmit={handle_submit} >
						<div className='row'>
							<div className='col-5'>
								<div className="form-floating">
									{(() => { console.log(today().getTime()); return <></>; })()}
									<input type="date" className="form-control" id="floatingFromDate" placeholder="From Date" defaultValue={date_to_format3(from)} name="from" />
									<label htmlFor="floatingFromDate">From</label>
								</div>
							</div>
							<div className='col-5'>
								<div className=" form-floating">
									<input type="date" className="form-control" id="floatingToDate" placeholder="To Date" defaultValue={date_to_format3(to)} name="to" />
									<label htmlFor="floatingFromDate">To</label>
								</div>
							</div>
							<div className='col-2'>
								<input type='submit' className="form-control btn btn-primary" />
							</div>
						</div>
					</form>
					<TableGrid data={punchlogs}>
						<TableGridHeader data-name={(x:typeof punchlogs[number])=>(<>
							{x.location}<br />
							(<Link to={`/device/item/${x.device_id}`}>{x.device_id}</Link>)
						</>)}>
							device
						</TableGridHeader>
						<TableGridHeader data-name={UserNameIdLink}>
							user
						</TableGridHeader>
						<TableGridHeader data-name={(x:typeof punchlogs[number])=>date_to_format1(new Date(x.time))}>
							time
						</TableGridHeader>
						<TableGridHeader data-name={(x:typeof punchlogs[number])=>{
							const photo = x.photo as unknown as string
							return photo ? <img src={`data:image/jpg;base64,${photo}`} style={{ width: "3em" }} /> : <></>
						}}>
							time
						</TableGridHeader>
					</TableGrid>
				</div>
			</div>
		</div>
	)
})
