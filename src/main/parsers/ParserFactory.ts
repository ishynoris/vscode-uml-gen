import { ClassMetadata, FileMetadata } from "../../common/types/backend.type";
import { Optional } from "../../common/types/classes.type";
import { IParserFile } from "../../common/types/interfaces.type";
import { Container } from "../Container";

export function getParser(file: FileMetadata): Optional<IParserFile> {
	const parser = Container.init().getParser(file);
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