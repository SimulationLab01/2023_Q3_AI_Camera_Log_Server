import React from "react"

export const NavbarBrand: React.FC<React.PropsWithChildren<{ href?: string }>> = (props) => {
	const href = props.href || ""
	return (
		<a className="navbar-brand" href={href}>
			{props.children}
		</a>
	)
}