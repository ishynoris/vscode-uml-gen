import { ClassDetail } from "../../../common/types/backend.type";
import { Component, DivOptions, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";

export class DetailComponent implements IComponent { 
	
	constructor(private detail: ClassDetail) { }

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

		childs.push(Dom.createLabel({ text: this.detail.name }))

		const options: DivOptions = {  
			id: `container-title-${this.detail.name}`,
			textAlign: "center",
			borderBottom: "1px solid white",
		}
		return Dom.createDiv(options, childs);
	}

	static create(detail: ClassDetail): Component {
		const component = new DetailComponent(detail);
		return component.getContent();
	}
}