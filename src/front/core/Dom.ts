import { DivOptions, Element, LabelOptions } from "../../main/types/parser.type";


export const Dom = {
	createDiv: (options: DivOptions, childs?: Element[]): Element => {
		const content: string = childs == undefined ? "" : childs.reduce(_reduceChild, "");
		const clss: string = options.class == undefined ? "" : options.class.join(" ");
		return { content: `<div style="padding: 10px;" id="${options?.id}" class="${clss}">${content}</div>` };
	},

	createLabel: (options: LabelOptions): Element => {
		const labelFor = options?.for ?? "";
		return { content: `<label for="${labelFor}">${options.text}</label>`}
	}
}

function _reduceChild(content: string, value: Element): string {
	return content += value.content;
}