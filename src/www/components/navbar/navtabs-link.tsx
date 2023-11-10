import React, { ReactNode, useCallback, useContext } from 'react'
import { classes } from '../../utils'
import { NavItem } from './nav-item'
import { NavLink } from './nav-link'
import { NavtabsLinkContext } from './navtabs'

export type NavtabsLinkPropsType = {
	disabled?: boolean,
	active?: boolean,
	children?: React.ReactNode
} | {
	label: React.ReactNode,
	disabled?: boolean,
	active?: boolean,
}

export const NavtabsLink: React.FC<NavtabsLinkPropsType> = (props) => {
	// const {active_setters_ref} = (props as typeof props & {active_setters_ref: React.RefObject<((x:boolean)=>void)[]>})
	const active_setters_ref = useContext(NavtabsLinkContext)
	const action = useCallback((ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		const a = ev.currentTarget;
		const li = a.parentElement as HTMLLIElement;
		const ul = li.parentElement as HTMLUListElement
		const links = [...ul.childNodes.values()].map(x => x.firstChild) as HTMLAnchorElement[]
		links.forEach((x, i) => {
			const active_setters = active_setters_ref.current![i] || []
			if (x == a) {
				x.classList.add('active')
				x.ariaCurrent = 'page'
				active_setters.forEach(x => x(true))
			}
			else {
				x.classList.remove('active')
				x.ariaCurrent = null
				active_setters.forEach(x => x(false))
			}
		})
	}, [active_setters_ref])
	return (
		<NavItem>
			<NavLink {...props} action={action} >{("label" in props) ? props.label : props.children}</NavLink>
		</NavItem>
	)
}