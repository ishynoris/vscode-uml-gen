import { Component, DivOptions, ItalicOptions, LabelOptions } from "../../common/types/frontend.type";
import { DivTemplate } from "./templates/DivTemplate";
import { ItalicTemplate } from "./templates/ItalicTemplate";
import { LabelTemplate } from "./templates/LabelTemplate";

export const Dom = {
	createDiv: (options: DivOptions, childs?: Component[]): Component => {
		const div = new DivTemplate(options);
		return { content: div.getContent(childs ?? []) };
	},

	createLabel: (options: LabelOptions): Component => {
		return { content: new LabelTemplate(options).getContent() }
	},

	createItalic: (options: ItalicOptions): Component => {
		return { content: new ItalicTemplate(options).getHtml() }
	}
}
