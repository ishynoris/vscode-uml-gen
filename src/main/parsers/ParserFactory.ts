import { JavaParser } from "./java/JavaParser";
import { ParserResult, IParserFile, FileMetadata } from "../types/parser.type";
import { Mock } from "../types/mock.types";

export function getParser(file: FileMetadata): ParserResult {
	const parsers = new Map<string, IParserFile>();
	const langId = file.extension;
	parsers.set("java", new JavaParser);

	let _parser = parsers.get(langId);
	const _isValid = _parser != undefined;
	const _error = _isValid ? "" : `Não foi possível definir o parser para o arquivo ${file.name}`;

	return {
		optional: {
			isValid: _isValid,
			value: _parser ?? Mock.getParserFile(),
		},
		error: _error,
	}
}