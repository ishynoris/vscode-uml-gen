import { KeyValue } from "./general.types";
import { ClassMetadata, FileMetadata } from "./backend.type";
import { Optional } from "./classes.type";

export interface IParserFile {
	parse(file: FileMetadata): Optional <ClassMetadata>;
}

export type IParser<T> = {
	getPatternRegex: () => string;
	getValue: (groups: KeyValue) => undefined | T;
	validator?: (value: T) => string[],
}