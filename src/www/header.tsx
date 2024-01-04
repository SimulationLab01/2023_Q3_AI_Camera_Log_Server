import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar, NavbarBrand, NavbarCollapse, NavbarDropdown, NavbarLink, NavbarRouteLink, NavbarToggler } from "./components/navbar";
import { useTranslation } from "./translation";
import { NavItem } from "./components/navbar/nav-item";
import { DropdownLink } from "./components/dropdown";

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
					<NavbarDropdown label={T.nav_item.punch_log}>
						<DropdownLink to="punch_log">
							{T.nav_item.punch_log}
						</DropdownLink>
						<DropdownLink to="punch_log/today">
							{T.nav_item.punch_log_today}
						</DropdownLink>
					</NavbarDropdown>
					<NavbarRouteLink active={loc.pathname == '/facecam' ? true : undefined} to="facecam">facecam</NavbarRouteLink>
					<NavbarLink action={`http://${location.hostname}:8081/phpmyadmin`} target="_blank">{T.nav_item.phpmyadmin}</NavbarLink>
					<NavbarRouteLink active={loc.pathname == '/about' ? true : undefined} to="about">{T.nav_item.about}</NavbarRouteLink>
				</NavbarCollapse>
			</Navbar>
		</header>
	)
}
