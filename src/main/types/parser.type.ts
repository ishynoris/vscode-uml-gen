
type Optional<T> = {
	isValid: boolean,
	value: T,
}

export type FileMetadata = {
	name: string,
	absolutePath: string,
	extension: string,
	content: string,
}

export interface IParserFile {
	parse(file: FileMetadata): ClassMetadataResult;
}

export type ParserResult = {
	optional: Optional<IParserFile>,
	error: string,
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

export type MethodResult = {
	optional: Optional<Method>,
	errors: string[],
}

export type ClassMetadata = {
	className: string,
	publicMethod: Method[],
	privateMethod: Method[],
}

export type ClassMetadataResult = {
	optional: Optional<ClassMetadata>,
	errors: string[],
}