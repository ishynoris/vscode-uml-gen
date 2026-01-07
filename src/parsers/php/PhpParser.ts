import { IParser, IParserFile } from "../../common/types/interfaces.type";
import { PhpRegexPareser } from "./PhpRegexParser";
import { Types } from "../../common/types/encapsulation.types";
import { PhpDetailParser } from "./PhpDetailParser";
import { PhpImportsParser } from "./PhpImportsParser";
import { WorkspaceFiles } from "../../common/types/classes.type";
import { PhpAttributeParser } from "./PhpAttributeParser";
import { Attribute, ClassDetail, Method, Namespace, Package } from "../../common/types/backend.type";
import { PhpPackageMapper } from "./PhpPackageMapper";
import { Workspace } from "../../main/util";
import { PhpNamespaceParser } from "./PhpNamespaceParser";

export class PhpParser implements IParserFile {

	private types: Types[];

	constructor(private workspace: WorkspaceFiles) {
		this.types = [ Types.public, Types.private, Types.protected ];
	}

	getDetailParser(): IParser<ClassDetail> {
		return new PhpDetailParser(this.types);
	}

	getAttributeParser(): IParser<Attribute> {
		return new PhpAttributeParser(this.types);
	}

	getMethodParser(): IParser<Method> {
		return new PhpRegexPareser(this.types);
	}

	getImportParser(): IParser<Package> {
		const composerPath = Workspace.getWorkspacePath("composer.json");
		if (composerPath == null) {
			throw new Error("Cannot load composer.json file");
		}
		const mapper = new PhpPackageMapper(this.workspace, composerPath);
		return new PhpImportsParser(mapper);
	}

	getNamespacePareser(): IParser<Namespace> {
		return new PhpNamespaceParser;
	}
}
