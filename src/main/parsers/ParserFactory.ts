import { TextDocument } from "vscode";
import { JavaParser } from "./JavaParser";
import { ParserResult, IParserFile, ClassMetadataResult } from "./parser.type";

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
			value: _parser ?? ParserFileMock,
		},
		error: _error,
	}
}

const ParserFileMock = {
	parse(doc: TextDocument): ClassMetadataResult { 

		const metadata = {
			className: "",
		}
		return { 
			optional: {
				isValid: false,
				value: metadata,
			},
			errors: [ 'ParserFileMock' ] 
		}
	}
}