import { DivOptions, Component, LabelOptions } from "../../main/types/parser.type";


export const Dom = {
	createDiv: (options: DivOptions, childs?: Component[]): Component => {
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

		return { content: `<div id="${id}" class="${clss}" style="${style}" >${content}</div>` };
	},

	createLabel: (options: LabelOptions): Component => {
		const labelFor = options?.for ?? "";
		return { content: `<label for="${labelFor}">${options.text}</label>`}
	}
}

function _reduceChild(content: string, value: Component): string {
	return content += value.content;
}