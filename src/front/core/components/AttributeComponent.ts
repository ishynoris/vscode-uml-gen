import { Attribute } from "../../../common/types/backend.type";
import { AttributeFormatter as Formatter } from "../../../common/types/classes.type";
import { Encapsulation } from "../../../common/types/encapsulation.types";
import { Component, DivOptions, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";


export class AttributeComponent implements IComponent {
	private formatter: Formatter;
	
	constructor(private name: string, private attr: Attribute) {
		this.formatter = new Formatter(attr);
	}

	static create(name: string, attr: Attribute): Component {
		const component = new AttributeComponent(name, attr);
		const childs = [ component.getContent() ];
		return Dom.createDiv({ id: `attr-${attr.name}` }, childs) ;
	}

	static createMany(name: string, attrs: Attribute[]): Component {
		const labels = attrs.map(attr => AttributeComponent.create(name, attr));
		const options: DivOptions = {
			id: `container-attrs-${this.name}`,
			class: [ "node-item" ],
			borderBottom: "1px solid white"
		}
		return Dom.createDiv(options, labels);
	}

	getContent(): Component {
		return Dom.createLabel({ text: this.formatter.getSignature() });
	}
}