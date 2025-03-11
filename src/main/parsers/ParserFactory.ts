import { TextDocument } from "vscode";
import { JavaParser } from "./java/JavaParser";
import { ParserResult, IParserFile, ClassMetadataResult } from "./parser.type";
import { Mock } from "./mock.types";

export function getParser(doc: TextDocument): ParserResult {
	const parsers = new Map<string, IParserFile>();
	const langId = doc.languageId;
	parsers.set("java", new JavaParser);

	let _parser = parsers.get(langId);
	const _isValid = _parser != undefined;
	const _error = _isValid ? "" : `Não foi possível definir o parser para o arquivo ${doc.fileName}`;

	return {
		optional: {
			isValid: _isValid,
			value: _parser ?? Mock.getParserFile(),
		},
		error: _error,
	}
}