import { Package, Optional, IPackageMapper, IParser } from "../../common/types";
import { Regex } from "../../main/util";
import { RegexGroups } from "../ParserFileRegex";

enum Def {
	use = "_pack_use",
}

export class PhpImportsParser implements IParser<Package> {

	constructor(private mapper: IPackageMapper) {
	}

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Def.use);
	}

	getPatternRegex(): string {
		const useKey = `(use)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}${Regex.Numbers}${Regex.Blank}_\\-\\\\]+`
		return `${useKey}(?<_pack_use>${namespaceKey});`;
	}

	getValue(groups: RegexGroups): Optional<Package> {
		const uses = groups.get(Def.use);
		if (uses.length == 0) {
			const errors = [ `Cannot get value of Package` ];
			return new Optional<Package>(undefined, errors);
		}

		const importsPart = uses.split("\\");
		const lastIndexPackage = importsPart.length - 1;
		const className = importsPart[lastIndexPackage];

		const pack = {
			classImported: className,
			package: uses,
			file: this.mapper.getFile(importsPart),
		}
		return new Optional(pack);
	}
}