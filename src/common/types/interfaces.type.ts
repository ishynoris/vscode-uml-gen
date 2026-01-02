import { RegexGroups } from "../../main/parsers/ParserFileRegex";
import { Attribute, ClassDetail, FileMetadata, Method, Namespace, Package } from "./backend.type";
import { Optional } from "./classes.type";

export interface IParserFile {
	getDetailParser(): IParser<ClassDetail>;

	getImportParser(): IParser<Package>;

	getAttributeParser(): IParser<Attribute>;

	getMethodParser(): IParser<Method>;

	getNamespacePareser(): IParser<Namespace>;
}

export interface IParser<T> {
	getPatternRegex(): string;

	getValue(groups: RegexGroups): Optional<T>;

	hasRequiredValues(groups: RegexGroups): boolean;

	validator?: (value: T) => string[],
}

export interface IPackageMapper {
	getFile(parts: string[]): undefined | FileMetadata;
}