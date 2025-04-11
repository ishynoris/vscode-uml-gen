import { KeyValue } from "./general.types";
import { Attribute, ClassDetail, FileMetadata, Method, Package } from "./backend.type";
import { Optional } from "./classes.type";

export interface IParserFile {
	getDetailParser(): IParser<ClassDetail>;

	getImportParser(): IParser<Package>;

	getAttributeParser(): IParser<Attribute>;

	getMethodParser(): IParser<Method>;
}

export interface IParser<T> {
	getPatternRegex(): string;

	getValue(groups: KeyValue): undefined | T;

	validator?: (value: T) => string[],
}

export interface IPackageMapper {
	getFile(parts: string[]): undefined | FileMetadata;
}