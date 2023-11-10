import React, { createRef, useRef, useState } from "react"
import { Outlet, useOutlet } from "react-router-dom"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { Footer } from "./footer"
import { Header } from "./header"


export const Layout: React.FC<{}> = (props) => {

	return (
			<div className="d-flex flex-column h-100">
				<Header />
				<main className="flex-fill">
					<Outlet />
				</main>
				<Footer />
			</div>
	)
}