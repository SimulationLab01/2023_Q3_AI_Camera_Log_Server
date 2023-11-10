import React from 'react'
import { classes } from '../../utils'
import { NavItem } from './nav-item'
import { NavLink } from './nav-link'
import { NavRouteLink } from './nav-route-link'

export const NavbarRouteLink: React.FC<React.PropsWithChildren<{
	disabled?: boolean
	active?: boolean
	to?: string
}>> = (props) => {
	return (
		<NavItem>
			<NavRouteLink {...props} >{props.children}</NavRouteLink>
		</NavItem>
	)
}