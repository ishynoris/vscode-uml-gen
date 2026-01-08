import { ClassMetadata, FileMetadata, Optional, IParserFile, Mock } from "../common/types";
import { FileReader } from "../main/util";
import { RegexGroups, ParserFileRegex } from "./ParserFileRegex";


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
		this.result.path = doc.absolutePath;

		const content = FileReader.readContentFromFile(doc);
		if (content.value == undefined) {
			return new Optional<ClassMetadata>(undefined, content.errors);
		}
		
		let detailExecuted = false,
			namespaceExecuted = false;
		
		const regex = new ParserFileRegex(content.value, this.parser);
		while (regex.hasNextExpression()) {
			const groups = regex.getExpression();
			if (groups == undefined) {
				this.errors.push(`Cannot parse regex "${regex.getCurrentSource()}"`);
				break;
			}

			if (!detailExecuted) {
				detailExecuted = this.defineClassName(groups);
			}

			if (!namespaceExecuted) {
				namespaceExecuted = this.defineNamespace(groups);
			}
			
			this.defineAttributes(groups);
			this.defineImports(groups);
			this.defineMethod(groups);
		}

		return new Optional(this.result, this.errors);
	}

	protected defineClassName(groups: RegexGroups): boolean {
		const parser = this.parser.getDetailParser();
		if (!parser.hasRequiredValues(groups)) {
			return false;
		}

		const details = parser.getValue(groups);
		if (details.value != undefined) {
			this.result.detail = details.value;
		}

		this.errors.push(...details.errors);
		return true;
	}

	protected defineNamespace(groups: RegexGroups): boolean {
		const parser = this.parser.getNamespacePareser();
		if (!parser.hasRequiredValues(groups)) {
			return false;
		}

		const namespace = parser.getValue(groups);
		if (namespace.value != undefined) {
			this.result.namespace.parts.push(...namespace.value.parts);
		}
		this.errors.push(...namespace.errors);
		return true;
	}

	protected defineAttributes(groups: RegexGroups) {
		const parser = this.parser.getAttributeParser();
		if (!parser.hasRequiredValues(groups)) {
			return;
		}

		const attribute = parser.getValue(groups);
		if (attribute.value != undefined) {
			this.result.attributes.push(attribute.value);
		}
		this.errors.push(...attribute.errors);
	}

	protected defineImports(groups: RegexGroups) {
		const parser = this.parser.getImportParser();
		if (!parser.hasRequiredValues(groups)) {
			return;
		}

		const imports = parser.getValue(groups);
		if (imports.value != undefined) {
			this.result.imports.push(imports.value);
		}
		this.errors.push(...imports.errors);
	}

	protected defineMethod(groups: RegexGroups) {
		const parser = this.parser.getMethodParser();
		if (!parser.hasRequiredValues(groups)) {
			return;
		}

		const method = parser.getValue(groups);
		if (method.value != undefined) {
			this.result.methods.push(method.value);
		}
		this.errors.push(...method.errors);
	}
}
