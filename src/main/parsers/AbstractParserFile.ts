import { Mock } from "../types/mock.types";
import { ClassMetadata, FileMetadata, IParseImport, IParseMethod, IParserFile, Optional } from "../types/parser.type";

export type Parsers = {
	importParser: IParseImport,
	methodParser: IParseMethod,
}

export abstract class AbstractParserFile implements IParserFile {

	protected errors: string[];
	protected result: ClassMetadata;
	protected doc!: FileMetadata;

	constructor(private parsers: Parsers) {
		this.errors = [];
		this.result = Mock.classMatadata;
	}

	public parse(doc: FileMetadata): Optional<ClassMetadata> {
		this.doc = doc;

		this.defineClassName();
		this.defineImports();
		this.defineMethod();

		return new Optional(this.result);
	}

	protected defineClassName() {
		const search = `.${this.doc.extension}`;
		const className = this.doc.name.replace(search, "");
		this.result.className = className;
	}

	protected defineImports() {
		const parser = this.parsers.importParser;
		const importsOpt = parser.parse(this.doc.content);
		const imports = importsOpt.value ?? [];

		this.errors.push(...importsOpt.errors);
		this.result.imports.push(...imports);
	}

	protected defineMethod() {
		const parser = this.parsers.methodParser;
		const methodOpt = parser.parse(this.doc.content);
		const methods = methodOpt.value ?? [];

		this.errors.push(...methodOpt.errors);
		this.result.methods.push(...methods);
	}
}