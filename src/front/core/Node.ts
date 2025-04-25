import { ClassMetadata } from "../../common/types/backend.type";
import { Area, Component, Coordinates, DivOptions, IAreaComponent } from "../../common/types/frontend.type";
import { AttributeComponent } from "./components/AttributeComponent";
import { MethodComponent } from "./components/MethodComponents";
import { DetailComponent, Details } from "./components/DetailComponent";
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
		const childs = [];

		const details: Details = { 
			...this.metadata.namespace,
			...this.metadata.detail,
		}
		childs.push(DetailComponent.create(details));

		if (this.metadata.attributes.length > 0) {
			const child = AttributeComponent.createMany(name, this.metadata.attributes);
			childs.push(child);
		}

		if (this.metadata.methods.length > 0) {
			const child = MethodComponent.createMany(name, this.metadata.methods);
			childs.push(child);
		}

		return childs;
	}

	private getDivOptions(): DivOptions {
		const dataPackages: KeyManyValues[] = [];
		const classImports = this.metadata.imports;
		if (classImports.length > 0) {
			const classImported = classImports.map(pack => pack.classImported);
			dataPackages.push({ "imports": classImported });
		}

		dataPackages.push({ "absolute_path": [ this.metadata.path ] })
		dataPackages.push({ "file_name": [ this.metadata.detail.name ] })

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