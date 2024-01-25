import React from "react";
import { Link } from "react-router-dom";
import { device, device_user_with_name, user } from "../../shared/infomation_schema";
import { TableGrid, TableGridHeader } from "./tablegrid";
/**
 * Wrapper for Div, allow non-plain (like object, function) set to data-* attribute, will be removed before render on DOM
 * Used for ``
 */
export const Div: React.FC<React.PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>> = ({children, ...div_props }) => { 
	const filtered_div_props = Object.fromEntries(Object.entries(div_props).filter(([k,v])=>{
		return k.startsWith('data-') && !("object" == typeof v || "function" == typeof v)
	}))
	return <div {...filtered_div_props}>{children}</div>
}

export const UserIdLink: React.FC<any> = (x) => (
	<Link to={`/user/item/${x.userId}`}>{x.userId}</Link>
)

export const UserNameIdLink: React.FC<any> = (x) => (
	<>
		{x.name}<br />
		(<Link to={`/user/item/${x.userId}`}>{x.userId}</Link>)
	</>
)

export const DeviceIdLink: React.FC<any> = (x) => (
	<Link to={`/device/item/${x.deviceId}`}>{x.deviceId}</Link>
)

export const DeviceState: React.FC<{ state: device['state'] }> = (x) => (x.state == 1 ? "已註冊" : "未註冊")

export const DeviceUsers: React.FC<{ device_users: device_user_with_name[] }> = (x) => (
	<TableGrid data={x.device_users}>
		<TableGridHeader data-name={UserIdLink}><br /></TableGridHeader>
		<div data-name="name"><br /></div>
		<div data-name="fullName"><br /></div>
	</TableGrid>
)