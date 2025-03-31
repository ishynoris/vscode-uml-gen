import { Mock } from "../types/mock.types";
import { Attribute, ClassMetadata, FileMetadata, IParser, IParserFile, Method, Optional, Package } from "../types/parser.type";

export type ParseContent = {
	imports: IParser<Package>,
	attributes: IParser<Attribute>,
	methods: IParser<Method>,
}

export abstract class AbstractParserFile implements IParserFile {

	protected errors: string[];
	protected result: ClassMetadata;
	protected doc!: FileMetadata;

	constructor(private parsers: ParseContent) {
		this.errors = [];
		this.result = Mock.classMatadata();
	}

	public parse(doc: FileMetadata): Optional<ClassMetadata> {
		this.doc = doc;

		this.defineClassName();
		this.defineAttributes();
		this.defineImports();
		this.defineMethod();

		return new Optional(this.result, this.errors);
	}

	protected defineClassName() {
		const search = `.${this.doc.extension}`;
		const className = this.doc.name.replace(search, "");
		this.result.className = className;
	}

	protected defineAttributes() {
		const parser = this.parsers.attributes;
		const attributesOpt = parse(this.doc.content, parser);
		const attributes = attributesOpt.value ?? [];

		this.errors.push(...attributesOpt.errors);
		this.result.attributes.push(...attributes);
	}

	protected defineImports() {
		const parser = this.parsers.imports;
		const importsOpt = parse(this.doc.content, parser);
		const imports = importsOpt.value ?? [];

		this.errors.push(...importsOpt.errors);
		this.result.imports.push(...imports);
	}

	protected defineMethod() {
		const parser = this.parsers.methods;
		const methodOpt = parse(this.doc.content, parser);
		const methods = methodOpt.value ?? [];

		this.errors.push(...methodOpt.errors);
		this.result.methods.push(...methods);
	}
}

function parse<T>(content: string, parser: IParser<T>): Optional<T[]> {
	const errors: string[] = [];
	const pattern = parser.getPatternRegex();

	const regex = new RegExp(pattern, "gi");
	const values: T[] = [];
	let expression;
	while((expression = regex.exec(content)) != null) {
		const groups = expression.groups;
		const signature = expression[0];
		if (groups == undefined) {
			errors.push(`Cannot parses ${signature}`);
			continue;
		}

		const value = parser.getValue(groups);
		if (value == undefined) {
			errors.push(`Cannot generates a value ${signature}`);
			continue;
		}

		if (parser.validator != undefined) {
			const errs = parser.validator(value);
			errors.push(...errs);
		}
		values.push(value);
	}

	return new Optional(values, errors);
}