import { Method } from "../../../common/types/backend.type";
import { MethodFormatter as Formatter} from "../../../common/types/classes.type";
import { Component, IComponent } from "../../../common/types/frontend.type";
import { Dom } from "../Dom";

export class MethodComponent implements IComponent {

	private formatter: Formatter;

	constructor(private method: Method) { 
		this.formatter = new Formatter(method);
	}

	static create(method: Method): Component {
		const component = new MethodComponent(method);
		const childs = [ component.getContent() ];
		return Dom.createDiv({ id: `method-${method.name}` }, childs) ;
	}

	static createMany(methods: Method[]): Component {
		const labels = methods.map(MethodComponent.create);
		return Dom.createDiv({ id: "container-methods" }, labels);
	}

	getContent(): Component {
		return Dom.createLabel({ text: this.formatter.getSignature() });
	}
}