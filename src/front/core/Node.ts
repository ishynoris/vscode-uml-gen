import { Encapsulation } from "../../main/types/encapsulation.types";
import { Args, ClassMetadata, DivOptions, Element, Method } from "../../main/types/parser.type";
import { Dom } from "./Dom";


type dictionary = { [ key: string ]: string };

export class Node {
	constructor(private metadata: ClassMetadata) {
	}
	
	getElement(): Element {
		const divOptions = this.getDivOptions();
		const childs = this.getChilds();

		return Dom.createDiv(divOptions, childs);
	}

	private getChilds(): Element[] {
		const title = this.getTitleNode();
		const labels = this.metadata.methods.map((method) => this.getMethodChild(method));

		const childs = [ title, ...labels ];
		return childs;
	}

	private getTitleNode(): Element {
		const name = this.metadata.className;
		const label = Dom.createLabel({ text: name });
		const options: DivOptions = {  
			id: _processId(name),
			textAlign: "center",
			borderBottom: "1px solid white",
		}
		return Dom.createDiv(options, [ label ]);
	}

	private getMethodChild(method: Method): Element {
		const methodSignature = new MethodArgs(method).getSignature();
		const label = Dom.createLabel({ text: methodSignature });

		return Dom.createDiv({ id: _processId(method.name) }, [ label ]);
	}

	private getDivOptions(): DivOptions {
		const name = this.metadata.className;
		return {
			id: `node-${_processId(name)}`,
			class: [ "node-div" ],
		}
	}
}

class MethodArgs {
	constructor(private method: Method) {
	}

	getSignature(): string {
		const symbol = this.getSymbol();
		const name = this.method.name;
		const args = this.getArgsName();
		const returnType = this.getReturnType();
		return `${symbol} ${name}(${args}): ${returnType}`;
	}


	getArgsName(): string {
		const mapArgName = (arg: Args): string => {
			let name = arg.name;
			if (arg.type != undefined) {
				name += `: ${arg.type}`;
			}
		
			if (arg.initialValue != undefined) {
				name += ` = ${arg.initialValue}`;
			}
			return _scapeHtmlEntity(name);
		}
		return this.method.args.map(mapArgName).join(", ");
	}

	getReturnType(): string {
		if (this.method.returnType == "") {
			return "void";
		}
		return _scapeHtmlEntity(this.method.returnType);
	}

	getSymbol(): string {
		return Encapsulation.getSymbol(this.method.encapsulation);
	}
}

function _processId(name: string): string {
	return name.replaceAll(" ", "-").toLowerCase().trim();
}

function _scapeHtmlEntity(text: string): string {
	const htmlEntity: dictionary  = {
		"<": "&#60;",
		">": "&#62;",
	}

	for (let key in htmlEntity) {
		text = text.replaceAll(key, htmlEntity[key]);
	}
	return text;
}