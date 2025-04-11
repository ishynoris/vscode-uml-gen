import { ClassMetadata, FileMetadata } from "../../common/types/backend.type";
import { Optional } from "../../common/types/classes.type";
import { IParser, IParserFile } from "../../common/types/interfaces.type";
import { Mock } from "../../common/types/mock.types";


export class ParserFile {

	protected errors: string[];
	protected result: ClassMetadata;
	protected doc!: FileMetadata;

	constructor(private parser: IParserFile) {
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
		const parser = this.parser.getDetailParser();
		const detailsOpt = parseOne(this.doc.content, parser);

		if (detailsOpt.value == undefined) {
			this.errors.push(`Can't extract details from class`)
			return;
		}

		this.result.detail = detailsOpt.value;
		this.errors.push(...detailsOpt.errors);
	}

	protected defineAttributes() {
		const parser = this.parser.getAttributeParser();
		const attributesOpt = parse(this.doc.content, parser);
		const attributes = attributesOpt.value ?? [];

		this.errors.push(...attributesOpt.errors);
		this.result.attributes.push(...attributes);
	}

	protected defineImports() {
		const parser = this.parser.getImportParser();
		const importsOpt = parse(this.doc.content, parser);
		const imports = importsOpt.value ?? [];

		this.errors.push(...importsOpt.errors);
		this.result.imports.push(...imports);
	}

	protected defineMethod() {
		const parser = this.parser.getMethodParser();
		const methodOpt = parse(this.doc.content, parser);
		const methods = methodOpt.value ?? [];

		this.errors.push(...methodOpt.errors);
		this.result.methods.push(...methods);
	}
}

function parseOne<T>(content: string, parser: IParser<T>): Optional<T> {
	const pattern = parser.getPatternRegex();
	const regex = new RegExp(pattern);
	const expression = regex.exec(content);
	const groups = expression?.groups;
	if (expression == null || groups == undefined) {
		return new Optional<T>(undefined, [ `Can't process regex ${pattern}` ]);
	}

	const errors: string[] = [];
	const value = parser.getValue(groups);
	return new Optional(value, errors);
}

function parse<T>(content: string, parser: IParser<T>): Optional<T[]> {
	const errors: string[] = [];
	const values: T[] = [];
	const pattern = parser.getPatternRegex();
	if (pattern.length == 0) {
		errors.push(`No regex pattern was defined to attributes`);
		return new Optional<T[]>(values, errors);
	}

	const regex = new RegExp(pattern, "gi");
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