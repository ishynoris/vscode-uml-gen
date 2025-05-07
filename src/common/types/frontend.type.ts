import { KeyManyValues, KeyValue } from "./general.types";

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

export type VSCodeAPI = {
	postMessage(message: any): void;

	getState(): any;

	setState(state: any): void;
};

export enum Messages {
	NewNode = "new-node",
}

export type FrontDataNode = {
	path?: string,
	file?: string,
	message?: Messages,
}

export class MessagesUtil {

	public readonly isNewNode: boolean

	constructor(private data: FrontDataNode) {
		this.isNewNode = this.data.message == Messages.NewNode;
	}

	static asString(): string {
		return JSON.stringify(Messages);
	}

	static asJSON(): string {
		return JSON.parse(MessagesUtil.asString());
	}
}