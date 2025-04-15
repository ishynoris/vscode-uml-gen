import { Namespace } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class PhpNamespaceParser implements IParser<Namespace> {
	

	hasRequiredValues(groups: KeyValue): boolean {
		return groups._namespace != undefined;
	}
	
	getPatternRegex(): string {
		const chars = `\\\\-_`
		const namespacePatter = `[${Regex.Letters}${Regex.Numbers}${chars}]+`
		return `namespace${Regex.BlankReq}(?<_namespace>${namespacePatter});`
	}

	getValue(groups: KeyValue): Optional<Namespace> {
		const namespace = groups._namespace ?? "";
		const parts = namespace == "" ? [] : namespace.split("\\");
		return new Optional<Namespace>({ parts: parts });
	}
}