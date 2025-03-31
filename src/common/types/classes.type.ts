import { Args, Attribute, FileMetadata, Method } from "./backend.type";
import { Encapsulation } from "./encapsulation.types";
import { Front as FrontEnd } from "../../main/util";

export type MapFilesMetada = Map<string,  FileMetadata>;

export class Optional<T> {

	public readonly hasValue!: boolean;
	public readonly hasErrors!: boolean;
	public readonly isValid!: boolean;

	constructor(
		public readonly value?: T, 
		public readonly errors: string[] = []
	) { 
		this.hasValue = value != undefined;
		this.hasErrors = errors.length > 0;
		this.isValid = this.hasValue && !this.hasErrors;
	}

	public getMessage(prefixError: string = ""): string {
		return this.errors.reduce((err, msg) => msg += `${prefixError} ${err}`);
	}
}

export class WorkspaceFiles {

	private classes: string[] = [];

	constructor(public readonly files: MapFilesMetada) {
		files.forEach((metadata, fileName) => {
			const extension = metadata.extension;
			const className = fileName.replace(extension, "");
			this.classes.push(className);
		});
	}

	hasClass(className: string): boolean {
		return this.classes.includes(className);
	}
}



export class AttributeFormatter {
	constructor(private attr: Attribute) { }

	static signature(attr: Attribute): string {
		return new AttributeFormatter(attr).getSignature();
	}

	getSignature(): string {
		const symbol = Encapsulation.getSymbol(this.attr.encapsulation);
		const name = this.attr.name;
		const type = this.attr.type;
		return `${symbol} ${name}: ${type}`;
	}
}

export class MethodFormatter {

	constructor(private method: Method) { }

	static signature(method: Method): string {
		return new MethodFormatter(method).getSignature();
	}

	getSignature(): string {
		const symbol = Encapsulation.getSymbol(this.method.encapsulation);
		const name = this.method.name;
		const args = this.getArgsName();
		const returnType = this.getReturnType();
		return `${symbol} ${name}(${args}): ${returnType}`;
	}


	private getArgsName(): string {
		const mapArgName = (arg: Args): string => {
			let name = arg.name;
			if (arg.type != undefined) {
				name += `: ${arg.type}`;
			}
		
			if (arg.initialValue != undefined) {
				name += ` = ${arg.initialValue}`;
			}
			return FrontEnd.scapeHtmlEntity(name);
		}
		return this.method.args.map(mapArgName).join(", ");
	}

	private getReturnType(): string {
		if (this.method.returnType == "") {
			return "void";
		}
		return FrontEnd.scapeHtmlEntity(this.method.returnType);
	}
}