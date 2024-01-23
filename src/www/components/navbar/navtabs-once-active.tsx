import { useContext, useState, useRef } from "react"
import { NavtabsContentContext } from "./navtabs"


export function useNavtabOnceActive(){
	const {index, initActive, active_setters_ref} = useContext(NavtabsContentContext)
	const [isActive, setActive] = useState(initActive)
	const onceActive = useRef<boolean>(isActive)
	onceActive.current = isActive || onceActive.current
	active_setters_ref.current![index].push(setActive)
	return onceActive.current
}

export const NavtabOnceActive: React.FC<React.PropsWithChildren<{}>> = (props) => {
	const onceActive = useNavtabOnceActive()
	return onceActive ? props.children : null
}
