import { Component, DivOptions, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";

export class NameComponent implements IComponent { 
	
	constructor(private name: string) { }

	getContent(): Component {
		const label = Dom.createLabel({ text: this.name });
		const options: DivOptions = {  
			id: `container-title-${this.name}`,
			textAlign: "center",
			borderBottom: "1px solid white",
		}
		return Dom.createDiv(options, [ label ]);
	}

	static create(name: string): Component {
		const component = new NameComponent(name);
		return component.getContent();
	}
}