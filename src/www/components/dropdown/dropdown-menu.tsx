import React from "react"

export const DropdownMenu: React.FC<React.PropsWithChildren<{target_id?:string}>> = (props) => {
	return (
		<ul className="dropdown-menu" aria-labelledby={props.target_id}>
			{props.children}
		</ul>
	)
}