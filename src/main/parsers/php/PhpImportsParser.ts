import { Package } from "../../../common/types/backend.type";
import { KeyValue } from "../../../common/types/general.types";
import { IPackageMapper, IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class PhpImportsParser implements IParser<Package> {

	constructor(private mapper: IPackageMapper) {

	}

	getPatternRegex(): string {
		const useKey = `(use)${Regex.BlankReq}`;
		const namespaceKey = `[${Regex.Letters}_\\-\\\\]+`
		return `${useKey}(?<_use>${namespaceKey});`;
	}

	getValue(groups: KeyValue): Package | undefined {
		const uses = groups._use ?? "";
		if (uses.length == 0) {
			return undefined;
		}

		const importsPart = uses.split("\\");
		const lastIndexPackage = importsPart.length - 1;
		const className = importsPart[lastIndexPackage];

		return {
			classImported: className,
			package: uses,
			file: this.mapper.getFile(importsPart),
		}
	}
}