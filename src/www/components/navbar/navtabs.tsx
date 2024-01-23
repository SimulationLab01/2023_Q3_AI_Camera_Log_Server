import React, { useContext, useMemo, useRef, useState } from 'react'
import { NavtabsLink, NavtabsLinkPropsType } from './navtabs-link'
import { NavtabsContent, NavtabsContentPropsType } from './navtabs-content'

function check_is_link(x: any): x is React.ReactElement<NavtabsLinkPropsType, typeof NavtabsLink> {
	return !!x && "object" == typeof x && ("type" in x) && x.type == NavtabsLink
}

function check_is_content(x: any): x is React.ReactElement<NavtabsContentPropsType, typeof NavtabsContent> {
	return (!!x && "object" == typeof x && ("type" in x) && x.type == NavtabsContent)
}

function ensure_is_array(x: any): any[] {
	return ((Array.isArray(x)) ? [...x] : [x])
}

type ActiveSetters = (((x:boolean)=>void)[])[]
type ActiveSettersRef = React.RefObject<ActiveSetters>
type NavtabsLinkContextValue = ActiveSettersRef
const defaultNavtabsLinkContextValue = undefined as unknown as NavtabsLinkContextValue
export const NavtabsLinkContext = React.createContext<NavtabsLinkContextValue>(defaultNavtabsLinkContextValue)

type NavtabsContentContextValue = {index: number, initActive: boolean, active_setters_ref: ActiveSettersRef}
const defaultActiveSetterRef = undefined as unknown as NavtabsContentContextValue
export const NavtabsContentContext = React.createContext<NavtabsContentContextValue>(defaultActiveSetterRef)

export const Navtabs: React.FC<{
	key_prefix: string,
	children?: (React.ReactElement<NavtabsLinkPropsType, typeof NavtabsLink> | React.ReactElement<NavtabsContentPropsType, typeof NavtabsContent> | React.ReactNode)[]
}> = (props) => {
	const children = ensure_is_array(props.children)
	const active_index = children.filter(check_is_link).findIndex(x=>x.props.active)
	const active_setters_ref = useRef<ActiveSetters>([])
	const [pre, links, post] = useMemo(()=>{
		const _1: React.ReactNode[] = []
		const _2: React.ReactElement<NavtabsLinkPropsType, typeof NavtabsLink>[] = []
		const _3: React.ReactNode[] = []
		let content_index = 0
		children.forEach((x, i)=>{
			if(check_is_link(x)){
				_2.push(<NavtabsLinkContext.Provider key={`${props.key_prefix}-${i}`} value={active_setters_ref}>{x}</NavtabsLinkContext.Provider>)
			}
			else if(check_is_content(x)){
				const index = content_index++
				const initActive = index == active_index
				active_setters_ref.current.push([])
				_3.push(<NavtabsContentContext.Provider key={`${props.key_prefix}-${i}`} value={{index, initActive, active_setters_ref}}>{x}</NavtabsContentContext.Provider>)
			}
			else{
				if(_2.length <= 0 ){
					_1.push(x)
				}
				else{
					_3.push(x)
				}
			}
		})
		return [_1, _2, _3]
	}, [...children])
	return (
		<div>
			{pre}
			<ul className="nav nav-tabs mb-1">
				{links}
			</ul>
			{post}
		</div>
	)
}
