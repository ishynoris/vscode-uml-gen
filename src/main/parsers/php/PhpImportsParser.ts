import { FileMetadata, Package } from "../../../common/types/backend.type";
import { WorkspaceFiles } from "../../../common/types/classes.type";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { FileFactory, Regex } from "../../util";

export class PhpImportsParser implements IParser<Package> {

	constructor(private workspace: WorkspaceFiles) {

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
			file: this.workspace.getFromPackage(importsPart, false),
		}
	}
}