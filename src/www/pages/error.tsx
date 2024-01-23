import { useRouteError } from "react-router-dom";
import { createRouteComponent } from "./route-component";
import React from "react";
import { mode } from "../global";

export const Error = createRouteComponent({
	path: "error",
}, (_) => {
	const error = useRouteError() as Error
	if(!error) return null
	return (
		<div className="container pt-3">
			{"production" == mode ? (
				<div>
					<h1>Error Happened</h1>
				</div>
			) : (
				<div>
					{...(error.stack || "").split('\n').map((x,i) => [i==0?<h1>{x}</h1>:x, <br />]).flat()}
				</div>
			)
			}
		</div>
	)
})