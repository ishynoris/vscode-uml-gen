import { ClassMetadata, FileMetadata } from "../../common/types/backend.type";
import { Optional } from "../../common/types/classes.type";
import { Container } from "../Container";
import { ParserFile } from "./ParserFile";

export function getParser(file: FileMetadata): ParserFile {
	const parser = Container.init().getParser(file);
	if (parser == undefined) {
		throw new Error(`Cannot define a parser to file  ${file.name}`);
	}
	return parser;
}

export function parse(file: FileMetadata): Optional<ClassMetadata> {
	const parser = getParser(file);
	return parser.parse(file);
}