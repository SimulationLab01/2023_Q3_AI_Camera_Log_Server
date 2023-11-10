import React from 'react'
import { classes } from '../../utils'

export const NavItem: React.FC<React.PropsWithChildren<{
	type?: "dropdown"
}>> = (props) => {
	const type = props.type || ""
	return (
		<li className={classes('nav-item', type)}>
			{props.children}
		</li>
	)
}