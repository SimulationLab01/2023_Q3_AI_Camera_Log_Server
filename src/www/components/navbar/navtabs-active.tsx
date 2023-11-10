import { useContext, useState } from "react"
import { NavtabsContentContext } from "./navtabs"

export function useNavtabIsActive() {
	const { index, initActive, active_setters_ref } = useContext(NavtabsContentContext)
	const [isActive, setActive] = useState(initActive)
	active_setters_ref.current![index].push(setActive)
	return isActive
}

export const NavtabActive: React.FC<React.PropsWithChildren<{}>> = (props) => {
	const isActive = useNavtabIsActive()
	return isActive ? props.children : null
}
