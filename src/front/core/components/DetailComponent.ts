import { ClassDetail, Namespace } from "../../../common/types/backend.type";
import { Component, DivOptions, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";

type Path = { path: string }

export type Details = ClassDetail & Namespace & Path

export class DetailComponent implements IComponent { 
	
	constructor(private detail: Details) { }

	getContent(): Component {
		const classifier: string[] = [];
		const childs: Component[] = []; 

		if (this.detail.isAbstract) {
			classifier.push("abstract");
		}

		if (this.detail.isStatic) {
			classifier.push("static");
		}

		if (classifier.length > 0) {
			const italic = Dom.createItalic({ text: `≪${classifier.join(" ")}≫` });
			childs.push(Dom.createDiv({ }, [ italic ]));
		}

		if (this.detail.isInterface) {
			const italic = Dom.createItalic({ text: `≪interface≫` });
			childs.push(Dom.createDiv({ }, [ italic ]));
		}

		if (this.detail.isEnum) {
			const italic = Dom.createItalic({ text: `≪enumeration≫` });
			childs.push(Dom.createDiv({ }, [ italic ]));
		}

		childs.push(Dom.createLabel({ text: this.getClassName() }))

		const options: DivOptions = {  
			id: `container-title-${this.detail.name}`,
			textAlign: "center",
			class: [ "node-item" ],
			borderBottom: "1px solid white",
			dataValue: [
				{ path: [ this.detail.path ] },
				{ file_name: [ this.detail.name ]}
			]
		}
		return Dom.createDiv(options, childs);
	}

	static create(detail: Details): Component {
		const component = new DetailComponent(detail);
		return component.getContent();
	}

	private getClassName(): string {
		const partsNamespace = this.detail.parts;
		if (partsNamespace.length == 0) {
			return this.detail.name;
		}

		partsNamespace.push(this.detail.name);
		return partsNamespace.join(".");
	}
}