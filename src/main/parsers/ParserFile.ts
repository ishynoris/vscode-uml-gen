import { ClassMetadata, FileMetadata } from "../../common/types/backend.type";
import { Optional } from "../../common/types/classes.type";
import { KeyValue } from "../../common/types/general.types";
import { IParser, IParserFile } from "../../common/types/interfaces.type";
import { Mock } from "../../common/types/mock.types";
import { FileReader } from "../util";


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
		
		let expression, 
			detailExecuted = false,
			namespaceExecuted = false;
		
		const regex = this.getRegex();
		while ((expression = regex.exec(content.value)) != null) {
			const groups = expression.groups;
			if (groups == undefined) {
				this.errors.push(`Cannot parse regex "${regex.source}"`);
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

	protected defineClassName(groups: KeyValue): boolean {
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

	protected defineNamespace(groups: KeyValue): boolean {
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

	protected defineAttributes(groups: KeyValue) {
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

	protected defineImports(groups: KeyValue) {
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

	protected defineMethod(groups: KeyValue) {
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

	private getRegex(): RegExp {
		const regexNamespace = this.parser.getNamespacePareser().getPatternRegex();
		const regexDetail = this.parser.getDetailParser().getPatternRegex();
		const regexAttribute = this.parser.getAttributeParser().getPatternRegex();
		const regexMethod = this.parser.getMethodParser().getPatternRegex();
		const regexImport = this.parser.getImportParser().getPatternRegex();

		const pattern = `(${regexNamespace})`
			+ `|(${regexDetail})`
			+ `|(${regexImport})`
			+ `|(${regexAttribute})`
			+ `|(${regexMethod})`;
		return new RegExp(pattern, "gi");
	}
}
