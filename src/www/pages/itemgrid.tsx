import React from "react"

export const HorizontalItemGrid: React.FC<React.PropsWithChildren<{
	item?: any,
	columns?: number,
	rows?: number,
}>> = ({ children, item, ...props }) => {
	const num_children = React.Children.count(children)
	const [num_columns, num_rows] = (() => {
		if (!!props.rows && !!props.columns) {
			return [props.rows, props.columns]
		}
		if (!!props.rows && !props.columns) {
			return [props.rows, undefined]
		}
		if (!props.rows && !!props.columns) {
			return [undefined, props.columns]
		}
		return [1, undefined]
	})()
	const grid: React.CSSProperties = {
		display: "grid",
		gridTemplateColumns: num_columns ? `repeat(${num_columns * 2}, fit-content(100%))` : "",
		gridTemplateRows: num_rows ? `repeat(${num_rows}, fit-content(100%))` : "",
		rowGap: 0,
		columnGap: '1em',
	}
	return (
		<div style={grid}>
			{React.Children.map(children, (x, i) => {
				const col = (i % (num_columns || 1)) + 1;
				const gridRow = i + 1;
				const data_name = React.isValidElement(x) ? x.props['data-name'] : undefined
				const cell = (() => {
					if ("function" == typeof data_name) {
						return data_name(item)
					}
					if ("string" == typeof data_name || "symbol" == typeof data_name || "number" == typeof data_name) {
						return item[data_name]
					}
					return `${data_name} ${typeof data_name}`
				})()
				return (
					<>
						<div style={{ gridRow, gridColumn: col }}>
							{x}
						</div>
						<div style={{ gridRow, gridColumn: col + 1 }}>
							{cell}
						</div>
					</>
				);
			})}
		</div>
	)
}

export const ItemGridHeader: React.FC<React.PropsWithChildren<{
	"data-name"?: string | symbol | ((x: any) => any)
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>> = ({ children, "data-name": _, ...div_props }) => {
	return <div {...div_props}>{children}</div>
}