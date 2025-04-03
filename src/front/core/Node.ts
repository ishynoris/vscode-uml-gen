import { ClassMetadata } from "../../common/types/backend.type";
import { Area, Component, Coordinates, DivOptions, IAreaComponent } from "../../common/types/frontend.type";
import { AttributeComponent } from "./components/AttributeComponent";
import { MethodComponent } from "./components/MethodComponents";
import { DetailComponent } from "./components/DetailComponent";
import { Dom } from "./Dom";
import { KeyManyValues } from "../../common/types/general.types";

export class Node implements IAreaComponent {

	public readonly tag: string;

	constructor(private metadata: ClassMetadata, private coords: Coordinates) {
		this.tag = metadata.detail.name;
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
		const name = _processId(this.tag);

		const title = DetailComponent.create(this.metadata.detail);
		const attributes = AttributeComponent.createMany(name, this.metadata.attributes);
		const methods = MethodComponent.createMany(name, this.metadata.methods);

		const childs = [ title, attributes, methods ];
		return childs;
	}

	private getDivOptions(): DivOptions {
		const dataPackages: KeyManyValues[] = [];
		const classImports = this.metadata.imports;
		if (classImports.length > 0) {
			const classImported = classImports.map(pack => pack.classImported);
			dataPackages.push({ "imports": classImported });
		}

		return {
			id: `node-${_processId(this.tag)}`,
			class: [ "node-container" ],
			coordinates: this.coords,
			dataValue: dataPackages,
		}
	}
}

function _processId(name: string): string {
	return name.replaceAll(" ", "-").toLowerCase().trim();
}