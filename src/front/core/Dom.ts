import { Component, DivOptions, ItalicOptions, LabelOptions } from "../../common/types/frontend.type";
import { Crypto } from "../../main/util";
import { DivTemplate } from "./templates/DivTemplate";
import { ItalicTemplate } from "./templates/ItalicTemplate";
import { LabelTemplate } from "./templates/LabelTemplate";

export const Dom = {
	createDiv: (options: DivOptions, childs?: Component[]): Component => {
		const div = new DivTemplate(options);
		return { content: div.getContent(childs ?? []) };
	},

	createCollapseDiv: (title: string, options: DivOptions, childs?: Component[]): Component => {
		const uniqid = Crypto.getUniqID();
		const labelTitle = Dom.createLabel({ 'text': `${title}&nbsp;&nbsp;` });
		const collapseTarget = `container-content-${uniqid}`;

		const optionsTitle: DivOptions = { 
			class: [ 'node-collapse'],
			dataValue: [ 
				{ "collapse": [ collapseTarget ] } 
			]
		};

		const optionsContent: DivOptions = {
			class: [ 'node-collapse-content'],
			id: collapseTarget,
			visible: false,
		};

		const divTitle = Dom.createDiv(optionsTitle, [ labelTitle ]);
		const divContent = Dom.createDiv(optionsContent, childs);
		return Dom.createDiv(options, [ divTitle, divContent ]);
	},

	createLabel: (options: LabelOptions): Component => {
		return { content: new LabelTemplate(options).getContent() }
	},

	createItalic: (options: ItalicOptions): Component => {
		return { content: new ItalicTemplate(options).getHtml() }
	}
}
