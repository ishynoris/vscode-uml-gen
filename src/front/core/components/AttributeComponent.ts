import { Attribute } from "../../../common/types/backend.type";
import { Encapsulation } from "../../../common/types/encapsulation.types";
import { Component, DivOptions, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";


export class AttributeComponent implements IComponent {
	private formatter: Formatter;
	
	constructor(private attr: Attribute) {
		this.formatter = new Formatter(attr);
	}

	static create(attr: Attribute): Component {
		const component = new AttributeComponent(attr);
		const childs = [ component.getContent() ];
		return Dom.createDiv({ id: `attr-${attr.name}` }, childs) ;
	}

	static createMany(attrs: Attribute[]): Component {
		const labels = attrs.map(AttributeComponent.create);
		const options: DivOptions = {
			id: "container-attrs",
			borderBottom: "1px solid white"
		}
		return Dom.createDiv(options, labels);
	}

	getContent(): Component {
		return Dom.createLabel({ text: this.formatter.getText() });
	}
}

class Formatter {
	constructor(private attr: Attribute) { }

	getText(): string {
		const symbol = Encapsulation.getSymbol(this.attr.encapsulation);
		const name = this.attr.name;
		const type = this.attr.type;
		return `${symbol} ${name}: ${type}`;
	}
}