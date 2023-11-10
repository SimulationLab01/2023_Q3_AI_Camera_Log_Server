import React from 'react'
import { classes } from '../../utils'
import { Link } from 'react-router-dom'

export const NavRouteLink: React.FC<React.PropsWithChildren<{
	disabled? : boolean
	active?: boolean
	to?: string
}>> = (props) => {
	const disabled = props.disabled? "disabled": ""
	const active = (!disabled && props.active) ? "active" : ""
	const current = props.active? "page": undefined
	const to =  props.to || ""
	return (
		<Link className={classes('nav-link' ,active, disabled)}
			aria-current={current}
			to={to}
			aria-disabled={!!disabled?true:undefined}
			state={{ some: "value" }}
			>{props.children}
		</Link>
	)
}