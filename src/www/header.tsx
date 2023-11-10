import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarRouteLink, NavbarToggler } from "./components/navbar";
import { useTranslation } from "./translation";

export const Header: React.FC<{}> = function (props) {
	const T = useTranslation()
	const loc = useLocation()
	return (
		<header>
			<Navbar>
				<NavbarBrand href="/">{T.title}</NavbarBrand>
				<NavbarToggler target_id="header-navbar" />
				<NavbarCollapse id="header-navbar">
					{...([
						<NavbarRouteLink active={loc.pathname == '/' ? true : undefined} to="/">{T.title}</NavbarRouteLink>
					])}
					<NavbarRouteLink active={loc.pathname == '/device' ? true : undefined} to="device">{T.nav_item.device}</NavbarRouteLink>
					<NavbarRouteLink active={loc.pathname == '/user' ? true : undefined} to="user">{T.nav_item.user}</NavbarRouteLink>
					<NavbarRouteLink active={loc.pathname == '/about' ? true : undefined} to="about">{T.nav_item.about}</NavbarRouteLink>
				</NavbarCollapse>
			</Navbar>
		</header>
	)
}
