import { Component, DivOptions } from "../../../common/types/frontend.type";
import { KeyManyValues, KeyValue } from "../../../common/types/general.types";

export class DivTemplate {

	constructor(private options: DivOptions) { }

	getContent(components: Component[]): string {
		const content = components.reduce((acc, comp) => acc += comp.content, "");
		const cls = this.options.class ?? [];
		const style = this.getStyle();
		const dataValues = this.getPseudData();

		const idContent = (this.options.id ?? "").length == 0 ? "" : `id="${this.options.id}"`;
		const clsContent = cls.length == 0 ? "" : `class="${cls.join(" ")}"`;
		const styleContent = style.length == 0 ? "" : `style="${style}"`
		return `<div ${idContent} ${clsContent} ${styleContent}${dataValues}>${content}</div>`;
	}

	private getStyle(): string {
		let style: string = "";
		if (this.options.textAlign != undefined) {
			style += `text-align: ${this.options.textAlign};`
		}

		if (this.options.borderBottom != undefined) {
			style += `border-bottom: ${this.options.borderBottom}`;
		}

		if (this.options.coordinates?.x) {
			style += `left: ${this.options.coordinates.x}px;`;
		}

		if (this.options.coordinates?.y) {
			style += `top: ${this.options.coordinates.y}px;`;
		}

		const visible = this.options.visible ?? true;
		if (!visible) {
			style += `display: none;`;
		}

		return style ?? "";
	}

	private getPseudData(): string {
		const dataValues = this.options.dataValue ?? [];
		if (dataValues.length == 0) {
			return "";
		}

		return dataValues.reduce((acc: "", keyValue: KeyManyValues) => {
			for (const key in keyValue) {
				const values: string[] = keyValue[key];
				acc += `data-${key}="${values.join(",")}" `;
			}
			return acc;
		}, "");
	}
}
