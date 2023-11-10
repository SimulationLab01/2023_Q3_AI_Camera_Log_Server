import React from "react"

export const DropdownItem: React.FC<React.PropsWithChildren<{
	href?: string
	onClick?: React.MouseEventHandler<HTMLAnchorElement>
}>> = (props) => {
	const href = (props.onClick)? undefined: props.href
	return (
		<li><a className="dropdown-item" href={href} onClick={props.onClick}>{props.children}</a></li>
	)
}