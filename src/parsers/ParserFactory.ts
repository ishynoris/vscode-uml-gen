import { ClassMetadata, FileMetadata, Optional } from "../common/types";
import { Container } from "../main/Container";
import { FileFactory } from "../main/util";
import { ParserFile } from "./ParserFile";

export function getParser(file: FileMetadata): ParserFile {
	const parser = Container.init().getParser(file);
	if (parser == undefined) {
		throw new Error(`Cannot define a parser to file  ${file.name}`);
	}
	return parser;
}

export function parseFromPath(absolutePath: string): Optional<ClassMetadata> {
	const file = FileFactory.fromAbsolutePath(absolutePath);
	if (file == undefined) {
		const message = `Can't parse file ${absolutePath}`;
		return new Optional<ClassMetadata>(undefined, [ message ]);
	}
	return parse(file);
}

export function parse(file: FileMetadata): Optional<ClassMetadata> {
	const parser = getParser(file);
	return parser.parse(file);
}