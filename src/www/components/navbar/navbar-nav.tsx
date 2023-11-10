import React from 'react'

export const NavbarNav: React.FC<React.PropsWithChildren<{}>> = (props) => {
	return (
		<ul className="navbar-nav me-auto mb-2 mb-lg-0">
			{props.children}
		</ul>
	)
}