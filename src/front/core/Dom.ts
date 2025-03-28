import { DivOptions, Element, LabelOptions } from "../../main/types/parser.type";


export const Dom = {
	createDiv: (options: DivOptions, childs?: Element[]): Element => {
		let style = "", id = "";
		const content: string = childs == undefined ? "" : childs.reduce(_reduceChild, "");
		const clss: string = options.class == undefined ? "" : options.class.join(" ");

		if (options.id != undefined) {
			id = options.id;
		}

		if (options.textAlign != undefined) {
			style += `text-align: ${options.textAlign};`
		}

		if (options.borderBottom != undefined) {
			style += `border-bottom: ${options.borderBottom}`;
		}

		return { content: `<div style="${style}" id="${id}" class="${clss}">${content}</div>` };
	},

	createLabel: (options: LabelOptions): Element => {
		const labelFor = options?.for ?? "";
		return { content: `<label for="${labelFor}">${options.text}</label>`}
	}
}

function _reduceChild(content: string, value: Element): string {
	return content += value.content;
}