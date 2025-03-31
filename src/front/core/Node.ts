import { ClassMetadata, DivOptions, Component, Method } from "../../main/types/parser.type";
import { AttributeComponent } from "./components/AttributeComponent";
import { MethodComponent } from "./components/MethodComponents";
import { Dom } from "./Dom";


export class Node {
	constructor(private metadata: ClassMetadata) {
	}
	
	getComponent(): Component {
		const divOptions = this.getDivOptions();
		const childs = this.getChilds();

		return Dom.createDiv(divOptions, childs);
	}

	private getChilds(): Component[] {
		const title = this.getTitleNode();
		const attributes = AttributeComponent.createMany(this.metadata.attributes);
		const methods = MethodComponent.createMany(this.metadata.methods);

		const childs = [ title, attributes, methods ];
		return childs;
	}

	private getTitleNode(): Component {
		const name = this.metadata.className;
		const label = Dom.createLabel({ text: name });
		const options: DivOptions = {  
			id: _processId(name),
			textAlign: "center",
			borderBottom: "1px solid white",
		}
		return Dom.createDiv(options, [ label ]);
	}

	private getDivOptions(): DivOptions {
		const name = this.metadata.className;
		return {
			id: `node-${_processId(name)}`,
			class: [ "node-div" ],
		}
	}
}

function _processId(name: string): string {
	return name.replaceAll(" ", "-").toLowerCase().trim();
}