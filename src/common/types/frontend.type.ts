type TextAlign = "center" | "end" | "justify" | "left" | "right";

export type Coordinates = {
	x?: number,
	y?: number,
	height?: number,
	width?: number,
}

export type DivOptions = { 
	id?: string,
	class?: string[],
	textAlign?: TextAlign,
	borderBottom?: string,
	coordinates?: Coordinates,
}

export type LabelOptions = {
	text: string,
	for?: string
}

export interface IComponent {
	getContent(): Component;
}

export type Component = {
	content: string,
	childs?: Component[]
}