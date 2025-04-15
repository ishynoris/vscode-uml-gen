import { JavaRegexParser } from "./JavaRegexParser";
import { Types } from "../../../common/types/encapsulation.types";
import { JavaImportParser } from "./JavaImportParser";
import { JavaAttributeParser } from "./JavaAttributeParser";
import { IParser, IParserFile } from "../../../common/types/interfaces.type";
import { JavaDetailParser } from "./JavaDetailParser";
import { WorkspaceFiles } from "../../../common/types/classes.type";
import { Attribute, ClassDetail, Method, Namespace, Package } from "../../../common/types/backend.type";
import { JavaPackageMapper } from "./JavaPackageMapper";
import { JavaNamespaceParser } from "./JavaNamespaceParser";

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
