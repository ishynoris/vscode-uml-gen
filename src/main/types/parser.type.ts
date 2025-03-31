import { Allowed } from "./encapsulation.types"; 

export type KeyValue = { 
	[ key: string ]: string 
}

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

export type MapFilesMetada = Map<string,  FileMetadata>;

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

export interface IComponent {
	getContent(): Component;
}

export interface IParserFile {
	parse(file: FileMetadata): Optional<ClassMetadata>;
}

export type IParser<T> = {
	getPatternRegex: () => string,
	getValue: (groups: KeyValue) => undefined | T,
	validator?: (value: T) => string[],
}

export type Attribute = {
	encapsulation: Allowed,
	type: string,
	name: string,
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

export type Package = {
	classImported: string,
	package: string,
	filePath?: string,
}

export type ClassMetadata = {
	attributes: Attribute[],
	imports: Package[],
	className: string,
	methods: Method[],
}

/** DOM Types */
type TextAlign = "center" | "end" | "justify" | "left" | "right";

export type DivOptions = { 
	id?: string,
	class?: string[],
	textAlign?: TextAlign,
	borderBottom?: string,
}

export type LabelOptions = {
	text: string,
	for?: string
}

export type Component = {
	content: string,
	childs?: Component[]
}