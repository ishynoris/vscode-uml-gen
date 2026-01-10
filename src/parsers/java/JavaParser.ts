import { EncapsulationType as Types, IParser, IParserFile, WorkspaceFiles, Attribute, ClassDetail, Method, Namespace, Package } from "../../common/types";
import { JavaRegexParser, JavaImportParser, JavaAttributeParser, JavaDetailParser, JavaPackageMapper, JavaNamespaceParser, } from "./types";

export class JavaParser implements IParserFile {

	private encapsulation: Types[] = [];

	constructor(private workspace: WorkspaceFiles) {
		this.encapsulation.push(Types.private);
		this.encapsulation.push(Types.protected);
		this.encapsulation.push(Types.public);
	}

	getImportParser(): IParser<Package> {
		const mapper = new JavaPackageMapper(this.workspace);
		return new JavaImportParser(mapper);
	}

	getDetailParser(): IParser<ClassDetail> {
		return new JavaDetailParser(this.encapsulation);
	}

	getMethodParser(): IParser<Method> {
		return new JavaRegexParser(this.encapsulation);
	}

	getAttributeParser(): IParser<Attribute> {
		return new JavaAttributeParser(this.encapsulation);
	}

	getNamespacePareser(): IParser<Namespace> {
		return new JavaNamespaceParser;
	}
}
