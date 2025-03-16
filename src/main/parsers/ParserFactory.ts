import { JavaParser } from "./java/JavaParser";
import { Optional, IParserFile, FileMetadata } from "../types/parser.type";
import { Mock } from "../types/mock.types";
import { PhpParser } from "./php/PhpParser";

export function getParser(file: FileMetadata): Optional<IParserFile> {
	const parsers = new Map<string, IParserFile>();
	const langId = file.extension;
	parsers.set("java", new JavaParser);
	parsers.set("php", new PhpParser);

	let _parser = parsers.get(langId) ?? Mock.getParserFile();
	const _isValid = _parser != undefined;
	const _error = _isValid ? "" : `Não foi possível definir o parser para o arquivo ${file.name}`;

	return {
		isValid: _isValid,
		errors: [ _error ],
		value: _parser
	}
}