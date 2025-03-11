import { TextDocument } from "vscode";

type Optional<T> = {
	isValid: boolean,
	value: T,
}

export interface IParserFile {
	parse(doc: TextDocument): ClassMetadataResult;
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