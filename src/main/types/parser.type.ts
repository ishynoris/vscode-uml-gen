import { Allowed } from "./encapsulation.types"; 
import { Types } from "./encapsulation.types";

export type Encapsulation = Allowed;

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

export type FileMetadata = {
	name: string,
	absolutePath: string,
	extension: string,
	content: string,
}

export interface IParserFile {
	parse(file: FileMetadata): Optional<ClassMetadata>;
}

export interface IParseMethod {
	parse(content: string): Optional<Method[]>
}

export type Args = {
	name: string,
	type?: string,
	initialValue?: string,
}

export type Method = {
	name: string,
	encapsulation: Allowed,
	returnType: string,
	args: Args[],
}

export type ClassMetadata = {
	className: string,
	methods: Method[],
}

/** DOM Types */
export type DivOptions = { 
	id?: string,
	class?: string[],
}

export type LabelOptions = {
	text: string,
	for?: string
}

export type Element = {
	content: string,
	childs?: Element[]
}