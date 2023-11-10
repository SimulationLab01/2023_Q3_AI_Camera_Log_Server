import React from 'react'
import { LoaderFunction } from "react-router-dom"

export type RouteInfo = {
	path?: (string | ((path: string) => string)) | (string | ((path: string) => string))[],
	loader_handler?: () => LoaderFunction
}

export function createRouteComponent<P={}>(info: RouteInfo, component: React.FC<P>) {
	return Object.assign(component, info)
}