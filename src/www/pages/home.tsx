import React from 'react'
import { useDocumentTitle } from 'usehooks-ts'
import { createRouteComponent } from './route-component'
import { useTranslation } from '../translation'

export const Home = createRouteComponent({
	path: ""
}, (props) => {
	const T = useTranslation()
	useDocumentTitle(T.title)
	return (
		<div className='w-100 h-100 d-flex flex-column align-items-center'>
			<h1 className="mt-5">
				Hello World
			</h1>
			<div>
			</div>
		</div>
	)
})
