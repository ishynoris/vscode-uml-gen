import { Package } from "../../../common/types/backend.type";
import { KeyValue } from "../../../common/types/general.types";
import { IPackageMapper, IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaImportParser implements IParser<Package> {

	constructor(private mapper: IPackageMapper) {
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
			file: this.mapper.getFile(importsPart),
			package: group._imports 
		}
	}
}