import { Package } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { IPackageMapper, IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
import { RegexGroups } from "../ParserFileRegex";

enum Attrs {
	imports = "pack_imports",
}

export class JavaImportParser implements IParser<Package> {

	constructor(private mapper: IPackageMapper) {
	}

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Attrs.imports);
	}

	public getPatternRegex(): string {
		const importKey = `(import)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}_\\-\\.]+`
		return `${importKey}(?<${Attrs.imports}>${namespaceKey});`;
	}

	public getValue(group: RegexGroups): Optional<Package> {
		const importsPart = group.split(".", Attrs.imports);
		const lastIndexPackage = importsPart.length - 1;
		const className = importsPart[lastIndexPackage];

		return new Optional({ 
			classImported: className, 
			file: this.mapper.getFile(importsPart),
			package: group.get(Attrs.imports),
		})
	}
}