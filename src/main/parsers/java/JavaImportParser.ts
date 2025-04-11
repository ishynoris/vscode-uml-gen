import { Package } from "../../../common/types/backend.type";
import { WorkspaceFiles } from "../../../common/types/classes.type";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
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

		return { 
			classImported: className, 
			file: this.workspace.getFromPackage(importsPart),
			package: group._imports 
		}
	}
}