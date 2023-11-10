import React from "react"

export const NavbarToggler: React.FC<React.PropsWithChildren<{ 
	target_id?: string
}>> = (props, context) => {
	const target = props.target_id? `#${props.target_id}`: undefined
	const target_id = props.target_id
	const icon = props.children || (<span className="navbar-toggler-icon" />)
	return (
		<button className="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target={target}
			aria-controls={target_id}
			aria-expanded="false"
			aria-label="Toggle navigation">
			{icon}
		</button>
	)
}