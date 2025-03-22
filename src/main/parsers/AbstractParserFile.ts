import { Mock } from "../types/mock.types";
import { ClassMetadata, FileMetadata, IParseMethod, IParserFile, Optional } from "../types/parser.type";

export abstract class AbstractParserFile implements IParserFile {

	protected errors: string[];
	protected result: ClassMetadata;
	protected doc!: FileMetadata;

	constructor(private methodParser: IParseMethod) {
		this.errors = [];
		this.result = Mock.classMatadata;
	}

	public parse(doc: FileMetadata): Optional<ClassMetadata> {
		this.doc = doc;

		this.defineClassName();
		this.defineMethod();

		return new Optional(this.result);
	}

	protected defineClassName() {
		const search = `.${this.doc.extension}`;
		const className = this.doc.name.replace(search, "");
		this.result.className = className;
	}

	protected defineMethod() {
		const methodOpt = this.methodParser.parse(this.doc.content);
		const methods = methodOpt.value ?? [];

		this.errors.push(...methodOpt.errors);
		this.result.methods.push(...methods);
	}
}