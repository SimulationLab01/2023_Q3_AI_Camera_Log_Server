import React from 'react'
import { DropdownMenu } from '../dropdown'
import { NavItem } from './nav-item'
import { NavLink } from './nav-link'

export const NavbarDropdown: React.FC<React.PropsWithChildren<{
	label?: React.ReactNode
}>> = (props) => {
	const label = props.label || "Dropdown"
	return (
		<NavItem type="dropdown">
			<NavLink type="dropdown-toggle">
				{label}
			</NavLink>
			<DropdownMenu>
				{props.children}
			</DropdownMenu>
		</NavItem>
	)
}