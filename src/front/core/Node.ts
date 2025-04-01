import { ClassMetadata } from "../../common/types/backend.type";
import { Area, Component, Coordinates, DivOptions, IAreaComponent } from "../../common/types/frontend.type";
import { AttributeComponent } from "./components/AttributeComponent";
import { MethodComponent } from "./components/MethodComponents";
import { NameComponent } from "./components/NameComponent";
import { Dom } from "./Dom";

export class Node implements IAreaComponent {

	public readonly tag: string;

	constructor(private metadata: ClassMetadata, private coords: Coordinates) {
		this.tag = metadata.className;
	}
	
	getArea(): Area {
		return this.coords
	}

	getContent(): Component {
		const divOptions = this.getDivOptions();
		const childs = this.getChilds();

		return Dom.createDiv(divOptions, childs);
	}

	private getChilds(): Component[] {
		const name = _processId(this.metadata.className);

		const title = NameComponent.create(this.metadata.className);
		const attributes = AttributeComponent.createMany(name, this.metadata.attributes);
		const methods = MethodComponent.createMany(name, this.metadata.methods);

		const childs = [ title, attributes, methods ];
		return childs;
	}

	private getDivOptions(): DivOptions {
		const name = this.metadata.className;
		return {
			id: `node-${_processId(name)}`,
			class: [ "node-div" ],
			coordinates: this.coords,
		}
	}
}

function _processId(name: string): string {
	return name.replaceAll(" ", "-").toLowerCase().trim();
}