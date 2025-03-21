import { Allowed } from "./encapsulation.types"; 
import { Types } from "./encapsulation.types";

export type Encapsulation = Allowed;

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