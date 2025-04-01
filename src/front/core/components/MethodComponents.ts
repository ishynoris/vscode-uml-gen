import { Method } from "../../../common/types/backend.type";
import { MethodFormatter as Formatter} from "../../../common/types/classes.type";
import { Component, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";

export class MethodComponent implements IComponent {

	private formatter: Formatter;

	constructor(private name: string, private method: Method) { 
		this.formatter = new Formatter(method);
	}

	static create(name: string, method: Method): Component {
		const component = new MethodComponent(name, method);
		const childs = [ component.getContent() ];
		return Dom.createDiv({ id: `method-${method.name}` }, childs) ;
	}

	static createMany(name: string, methods: Method[]): Component {
		const labels = methods.map(method => MethodComponent.create(name, method));
		return Dom.createDiv({ id: `container-methods-${this.name}` }, labels);
	}

	getContent(): Component {
		return Dom.createLabel({ text: this.formatter.getSignature() });
	}
}