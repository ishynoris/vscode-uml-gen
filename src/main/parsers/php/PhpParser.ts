import { Mock } from "../../types/mock.types";
import { ClassMetadata, FileMetadata, IParserFile, Optional } from "../../types/parser.type";

export class PhpParser implements IParserFile {

	parse(file: FileMetadata): Optional<ClassMetadata> {
		return Mock.getClassMetadataResult();
	}
}