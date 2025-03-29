import { IParseImport, KeyValue, Optional, Package } from "../../types/parser.type";
import { Regex, Workspace } from "../../util";
import { AbstractParserImport, MetadataImport } from "../AbstractParserImport";

export class JavaImportParser extends AbstractParserImport implements IParseImport {

	protected getRegexPattern(): string {
		const importKey = `(import)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}_\\-\\.]+`
		return `${importKey}(?<_imports>${namespaceKey});`;
	}

	protected parserRegexGroup(group: KeyValue): null | MetadataImport {
		let absolutePath: undefined | string;
		const importsPart = group._imports.split(".");
		const className = importsPart[importsPart.length - 1];

		if (!this.hasClass(className)) {
			return null;
		}
		return { 
			file: className, 
			filePath: absolutePath, 
			package: group._imports 
		}
	}
}