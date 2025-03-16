
export type Optional<T> = {
	isValid: boolean,
	errors: string[],
	value: T,
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
	type: string,
}

export type Method = {
	name: string,
	encapsulation: string,
	returnType: string,
	args: Args[],
}

export type ClassMetadata = {
	className: string,
	publicMethod: Method[],
	privateMethod: Method[],
}