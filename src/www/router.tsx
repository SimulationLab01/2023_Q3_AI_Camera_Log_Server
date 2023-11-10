import * as jose from 'jose'
import React from "react"
import { LoaderFunction, RouteObject, RouterProvider, createBrowserRouter, redirect } from "react-router-dom"
import { Layout } from "./layout"
import { Error as ErrorBoundary } from "./pages/error"
import * as pages from './pages'
import { RouteInfo } from './pages/route-component'

function pages_to_routes(pages: any) {
	return Object.entries(pages).map(([k, v]) => ({
		path: `${k.toLowerCase()}`,
		Page: v as RouteInfo
	})).map(x => {
		const info = x.Page
		const pathes = (function () {
			if ("string" == typeof info.path) {
				return [info.path]
			}
			if ("function" == typeof info.path) {
				return [info.path(x.path)]
			}
			if ("object" == typeof info.path && Array.isArray(info.path)) {
				return info.path.map(xx => {
					if ("string" == typeof xx) {
						return xx
					}
					if ("function" == typeof xx) {
						return xx(x.path)
					}
					return `${xx}`
				})
			}
			return [x.path]
		})()
		const loader_handler = info.loader_handler || (() => undefined)
		const loader: LoaderFunction | undefined = loader_handler()
		return pathes.map(path => ({ path, Component: x.Page, loader } as RouteObject))
	}).flat()
}

const routes: RouteObject[] = [
	{
		path: '/', element: <Layout />, loader: async (args) => {
			return null
		},
		children: [
			...pages_to_routes(pages),
			{ path: '*', loader: () => redirect('/') }
		],
		errorElement: <ErrorBoundary />
	}
]
const router = createBrowserRouter(routes)

export const Router: React.FC<{}> = function (props) {
	return (
		<RouterProvider {...{ router }} />
	)
}