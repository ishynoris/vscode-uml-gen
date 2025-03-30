import { Container } from "../../Container";
import { IParser, KeyValue, Optional, Package, WorkspaceFiles } from "../../types/parser.type";
import { Regex, Workspace } from "../../util";

export class JavaImportParser implements IParser<Package> {

	constructor(private workspace: WorkspaceFiles) {
	}

	public getPatternRegex(): string {
		const importKey = `(import)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}_\\-\\.]+`
		return `${importKey}(?<_imports>${namespaceKey});`;
	}

	public getValue(group: KeyValue): undefined | Package {
		let absolutePath: undefined | string;
		const importsPart = group._imports.split(".");
		const className = importsPart[importsPart.length - 1];

		if (!this.workspace.hasClass(className)) {
			return undefined;
		}
		return { 
			classImported: className, 
			filePath: absolutePath, 
			package: group._imports 
		}
	}
}