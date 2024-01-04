import React from "react"

export const TableGrid: React.FC<React.PropsWithChildren<{
	gridTemplateColumns?: React.CSSProperties['gridTemplateColumns'],
	data?: any[]
}>> = (prop) => {
	const num_children = React.Children.count(prop.children)
	const grid: React.CSSProperties = {
		display: 'grid',
		rowGap: 0,
		columnGap: '1em',
		gridTemplateColumns: prop.gridTemplateColumns || `repeat(${num_children}, fit-content(100%))`
	}
	const column: React.CSSProperties = {
		paddingLeft: "0.5em",
		paddingRight: "0.5em",
	}
	const header_background: React.CSSProperties = {
	}
	const header_column_background: React.CSSProperties = {
		borderBottomStyle: 'solid', borderBottomWidth: 2, borderBottomColor: 'var(--bs-secondary)'
	}
	const header_column: React.CSSProperties = {
		...column
	}
	const header_separator: React.CSSProperties = {
		height: "0.5em"
	}
	const data_background: React.CSSProperties = {
	}
	const data_even_background: React.CSSProperties = {
		background: 'var(--bs-white)'
	}
	const data_odd_background: React.CSSProperties = {
		background: 'var(--bs-light)'
	}
	const data_column: React.CSSProperties = {
		...column
	}
	return (
		<div style={grid}>
			{/* Header Background */}
			<div style={{ gridRow: 1, gridColumnStart: 1, gridColumnEnd: num_children + 1, width: "100%", ...header_background }} />
			{/* Header Columns Background */}
			{React.Children.map(prop.children, (x, i) => {
				const gridColumn = i + 1;
				return (
					<div style={{ gridRow: 1, gridColumn, ...header_column_background }} />
				);
			})}
			{/* Header Columns */}
			{React.Children.map(prop.children, (x, i) => {
				const gridColumn = i + 1;
				return (
					<div style={{ gridRow: 1, gridColumn, ...header_column }}>
						{x}
					</div>
				);
			})}
			{/* Header Separator */}
			<div style={{ gridRow: 2, gridColumnStart: 1, gridColumnEnd: num_children + 1, width: "100%", ...header_separator }} />
			{/* Data Columns */}
			{prop.data ? prop.data.map((data, i) => {
				const gridRow = i + 3;
				return [
					<div key={`data ${gridRow}`} style={{ gridRow, gridColumnStart: 1, gridColumnEnd: num_children + 1, width: "100%", ...data_background, ...(gridRow % 2 == 0 ? data_even_background : data_odd_background) }} />
				].concat(
					React.Children.map(prop.children, (x, i) => {
						const gridColumn = i + 1;
						const data_name = React.isValidElement(x) ? x.props['data-name'] : undefined
						const cell = (() => {
							if ("function" == typeof data_name) {
								return data_name(data)
							}
							if ("string" == typeof data_name || "symbol" == typeof data_name || "number" == typeof data_name) {
								return data[data_name]
							}
							return `${data_name}`
						})()
						return (
							<div key={`data ${gridRow} ${gridColumn}`} style={{ gridRow, gridColumn, ...data_column }}>
								{cell}
							</div>
						);
					}) || []);
			}).flat() : []}
		</div>
	)
}

export const TableGridHeader: React.FC<React.PropsWithChildren<{
	"data-name"?: string | symbol | ((x: any) => any)
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>> = ({children, "data-name": _, ...div_props }) => {
	return <div {...div_props}>{children}</div>
}

