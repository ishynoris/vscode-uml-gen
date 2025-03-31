import { ClassMetadata, FileMetadata } from "../../common/types/backend.type";
import { Optional } from "../../common/types/classes.type";
import { IParserFile } from "../../common/types/interfaces.type";
import { JavaParser } from "./java/JavaParser";
import { PhpParser } from "./php/PhpParser";

export function getParser(file: FileMetadata): Optional<IParserFile> {
	const parsers = new Map<string, IParserFile>();
	const langId = file.extension;
	parsers.set("java", new JavaParser);
	parsers.set("php", new PhpParser);

	const parser = parsers.get(langId);
	const isValid = parser != undefined;
	const errors = isValid ? [] : [ `Não foi possível definir o parser para o arquivo ${file.name}` ];
	return new Optional(parser, errors)
}

export function parse(file: FileMetadata): Optional<ClassMetadata> {
	const parser = getParser(file);
	if (parser.value == undefined) {
		return new Optional<ClassMetadata>(undefined, parser.errors);
	}

	return parser.value.parse(file);
}