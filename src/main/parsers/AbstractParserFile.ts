import { Mock } from "../types/mock.types";
import { ClassMetadata, FileMetadata, IParseMethod, IParserFile, Optional } from "../types/parser.type";

export abstract class AbstractParserFile implements IParserFile {

	protected result: Optional<ClassMetadata>;
	protected doc!: FileMetadata;

	constructor(private methodParser: IParseMethod, ) {
		this.result = Mock.getClassMetadataResult();
	}

	public parse(doc: FileMetadata): Optional<ClassMetadata> {
		this.doc = doc;

		this.defineClassName();
		this.defineMethod();

		this.result.isValid = this.result.errors.length == 0;
		return this.result;
	}

	protected defineClassName() {
		const search = `.${this.doc.extension}`;
		const className = this.doc.name.replace(search, "");
		this.result.value.className = className;
	}

	protected defineMethod() {
		const methodOpt = this.methodParser.parse(this.doc.content);

		this.result.errors.push(...methodOpt.errors);
		this.result.value.methods.push(...methodOpt.value);
	}
}