import React from 'react'

export const Navbar: React.FC<React.PropsWithChildren<{}>> = (props) => {
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary">
			<div className="container-fluid">
				{props.children}
			</div>
		</nav>
	)
}