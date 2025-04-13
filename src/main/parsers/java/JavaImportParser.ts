import { Package } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { KeyValue } from "../../../common/types/general.types";
import { IPackageMapper, IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaImportParser implements IParser<Package> {

	constructor(private mapper: IPackageMapper) {
	}

	hasRequiredValues(groups: KeyValue): boolean {
		return groups.pack_imports != undefined;
	}

	public getPatternRegex(): string {
		const importKey = `(import)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}_\\-\\.]+`
		return `${importKey}(?<pack_imports>${namespaceKey});`;
	}

	public getValue(group: KeyValue): Optional<Package> {
		const importsPart = group.pack_imports.split(".");
		const lastIndexPackage = importsPart.length - 1;
		const className = importsPart[lastIndexPackage];

		return new Optional({ 
			classImported: className, 
			file: this.mapper.getFile(importsPart),
			package: group.pack_imports 
		})
	}
}