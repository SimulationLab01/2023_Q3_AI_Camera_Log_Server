import React, { useContext } from "react"
import { useTranslation } from "./translation"
import * as g from './global'
import { Link } from "react-router-dom"

export const Footer: React.FC<{}> = function (props) {
	const T = useTranslation()
	return (
		<footer className="mt-auto py-3 bg-light">
			<div className="container" onLoad={() => { }}>
				© 2023 - {T.title} - ver. {g.version} | <Link to='/about'>{T.nav_item.about}</Link>
			</div>
		</footer>
	)
}