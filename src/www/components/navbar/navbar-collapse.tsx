import React from 'react'
import { NavbarNav } from './navbar-nav'

export const NavbarCollapse: React.FC<React.PropsWithChildren<{
	id: string
}>> = (props) => {
	return (
		<div id={props.id} className="collapse navbar-collapse">
			<NavbarNav>
				{props.children}
			</NavbarNav>
		</div>
	)
}