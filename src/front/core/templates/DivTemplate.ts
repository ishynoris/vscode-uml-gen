import { Component, DivOptions } from "../../../common/types/frontend.type";

export class DivTemplate {

	constructor(private options: DivOptions) { }

	getContent(components: Component[]): string {
		const content = components.reduce((acc, comp) => acc += comp.content, "");
		const cls = this.options.class ?? [];
		const style = this.getStyle();

		const idContent = (this.options.id ?? "").length == 0 ? "" : `id="${this.options.id}"`;
		const clsContent = cls.length == 0 ? "" : `class="${cls.join(" ")}"`;
		const styleContent = style.length == 0 ? "" : `style="${style}"`
		return `<div ${idContent} ${clsContent} ${styleContent}>${content}</div>`;
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

		return style ?? "";
	}
}
