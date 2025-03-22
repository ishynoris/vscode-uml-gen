import { JavaParser } from "./java/JavaParser";
import { Optional, IParserFile, FileMetadata } from "../types/parser.type";
import { PhpParser } from "./php/PhpParser";

export function getParser(file: FileMetadata): Optional<IParserFile> {
	const parsers = new Map<string, IParserFile>();
	const langId = file.extension;
	parsers.set("java", new JavaParser);
	parsers.set("php", new PhpParser);

	const parser = parsers.get(langId);
	const isValid = parser != undefined;
	const error = isValid ? "" : `Não foi possível definir o parser para o arquivo ${file.name}`;
	return new Optional(parser, [ error ]);
}