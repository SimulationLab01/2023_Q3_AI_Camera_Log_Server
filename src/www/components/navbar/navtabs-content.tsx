import React, { useContext, useState } from 'react'
import { NavtabsContentContext } from './navtabs'
import { useNavtabIsActive } from './navtabs-active'

export type NavtabsContentPropsType = React.PropsWithChildren<{}>

export const NavtabsContent: React.FC<NavtabsContentPropsType> = (props) => {
	const isActive = useNavtabIsActive()
	const css: React.CSSProperties | undefined = isActive? undefined: {display: 'none'}
	return (
		<div style={css} >
			{props.children}
		</div>
	)
}

