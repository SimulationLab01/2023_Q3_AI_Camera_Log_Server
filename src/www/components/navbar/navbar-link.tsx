import React, { HTMLAttributeAnchorTarget } from 'react'
import { classes } from '../../utils'
import { NavItem } from './nav-item'
import { NavLink } from './nav-link'

export const NavbarLink: React.FC<React.PropsWithChildren<{
	disabled?: boolean
	active?: boolean
	action?: string | React.MouseEventHandler<HTMLAnchorElement>
	target?: HTMLAttributeAnchorTarget
}>> = (props) => {
	return (
		<NavItem>
			<NavLink {...props} >{props.children}</NavLink>
		</NavItem>
	)
}