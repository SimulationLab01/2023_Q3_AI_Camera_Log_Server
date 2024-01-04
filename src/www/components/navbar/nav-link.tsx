import React, { HTMLAttributeAnchorTarget } from 'react'
import { classes } from '../../utils'

export const NavLink: React.FC<React.PropsWithChildren<{
	type?: "dropdown-toggle"
	disabled?: boolean
	active?: boolean
	action?: string | React.MouseEventHandler<HTMLAnchorElement>
	expanded?: boolean
	target?: HTMLAttributeAnchorTarget
}>> = (props) => {
	const type = props.type || ""
	const disabled = props.disabled ? "disabled" : ""
	const active = (!disabled && !type && props.active) ? "active" : ""
	const current = props.active ? "page" : undefined
	const href = (!type && "string" == typeof props.action && props.action) ? props.action : undefined
	const clickHandler = ("function" == typeof props.action) ? props.action : undefined
	const role = ("dropdown-toggle" == type) ? "button" : undefined
	const bs_toggle = ("dropdown-toggle" == type) ? "dropdown" : undefined
	const expanded = ("dropdown-toggle" == type && props.expanded) ? true : undefined
	const target = props.target;
	return (
		<a className={classes('nav-link', type, active, disabled)}
			aria-current={current}
			href={href}
			onClick={clickHandler}
			aria-disabled={!!disabled ? true : undefined}
			role={role}
			data-bs-toggle={bs_toggle}
			aria-expanded={expanded}
			target={target}
		>{props.children}
		</a>
	)
}