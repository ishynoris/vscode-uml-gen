import { KeyManyValues } from "./general.types";

type TextAlign = "center" | "end" | "justify" | "left" | "right";

export type Area = {
	height: number,
	width: number,
}

export type Position = {
	x: number,
	y: number,
}

export type Coordinates = Area & Position;

export type DivOptions = { 
	id?: string,
	class?: string[],
	textAlign?: TextAlign,
	borderBottom?: string,
	coordinates?: Coordinates,
	dataValue?: KeyManyValues[],
	visible?: boolean,
}

export type ItalicOptions = {
	text: string,
}

export type LabelOptions = {
	text: string,
	for?: string
}

export interface ITemplate {
	getHtml(): string;
}

export interface IComponent {
	getContent(): Component;
}

export interface IContainer extends IComponent {
	getContainerId(): string;
}

export interface IAreaComponent extends IComponent {
	getArea(): Area;
}

export type Component = {
	content: string,
	childs?: Component[]
}