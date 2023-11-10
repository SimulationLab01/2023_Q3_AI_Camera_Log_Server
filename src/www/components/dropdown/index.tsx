import React from "react"
import { classes } from "../../utils"
import { DropdownMenu } from "./dropdown-menu"
export * from './dropdown-menu'
export * from './dropdown-item'
export * from './dropdown-link'
export * from './dropdown-divider'

export const Dropdown: React.FC<React.PropsWithChildren<{id: string, className?: string, label?: string}>> = (props)=>{
	return (
		<div id={props.id} className={classes("dropdown", props.className)}>
			<button id={`${props.id}-dropdown`} className="btn btn-secondary dropdown-toggle"
					data-bs-toggle="dropdown" aria-expanded="false">
					{props.label}
			</button>
			<DropdownMenu target_id={`${props.id}-dropdown`}>
				{props.children}
			</DropdownMenu>
		</div>
	)
}