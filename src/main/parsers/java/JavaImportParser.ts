import { IParser, KeyValue, Package, WorkspaceFiles } from "../../types/parser.type";
import { FileFactory, Regex, Workspace } from "../../util";

export class JavaImportParser implements IParser<Package> {

	constructor(private workspace: WorkspaceFiles) {
	}

	public getPatternRegex(): string {
		const importKey = `(import)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}_\\-\\.]+`
		return `${importKey}(?<_imports>${namespaceKey});`;
	}

	public getValue(group: KeyValue): undefined | Package {
		const importsPart = group._imports.split(".");
		const lastIndexPackage = importsPart.length - 1;
		const className = importsPart[lastIndexPackage];

		if (!this.workspace.hasClass(className)) {
			return undefined;
		}

		importsPart[lastIndexPackage] = `${className}.java`;
		const absolutePath = Workspace.getAbsolutePath(importsPart);
		if (absolutePath == undefined) {
			return undefined;
		}
		return { 
			classImported: className, 
			file: FileFactory.fromAbsolutePath(absolutePath),
			package: group._imports 
		}
	}
}