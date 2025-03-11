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

export type ClassMetadata = {
	className: string,
}

export type ClassMetadataResult = {
	optional: Optional<ClassMetadata>,
	errors: string[],
}