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
		return component.getContent();
	}

	static createMany(name: string, methods: Method[]): Component {
		const labels = methods.map(method => MethodComponent.create(name, method));
		return Dom.createCollapseDiv("Methods", { id: `container-methods-${name}` }, labels);
	}

	getContent(): Component {
		const childs: Component[] = [];
		const classifier: string[] = [];
		if (this.method.isAbstract) {
			classifier.push("abstract");
		}

		if (this.method.isStatic) {
			classifier.push("static");
		}

		if (classifier.length > 0) {
			// const italic = Dom.createItalic({ text: `≪${classifier.join(" ")}≫` });
			// childs.push(Dom.createDiv({ }, [ italic ]));
		}

		childs.push(Dom.createLabel({ text: this.formatter.getSignature() }));
		const options = {
			id: `method-${this.method.name}`,
			class: [ "node-item" ],
		}
		return Dom.createDiv(options, childs) ;
	}


}