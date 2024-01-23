import React from "react"
import { Link } from "react-router-dom"

export const DropdownLink: React.FC<React.PropsWithChildren<{
	to: string,
	state?: any
}>> = (props) => {
	return (
		<li><Link className="dropdown-item" to={props.to} state={props.state}>{props.children}</Link></li>
	)
}