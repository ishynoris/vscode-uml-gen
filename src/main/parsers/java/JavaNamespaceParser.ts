import { Namespace } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaNamespaceParser implements IParser<Namespace> {

	hasRequiredValues(groups: KeyValue): boolean {
		return true;
	}

	getPatternRegex(): string {
		const namespace = `[${Regex.Letters}${Regex.Numbers}\.-_]+`
		return `package${Regex.BlankReq}(?<_namespace>${namespace});`
	}

	getValue(groups: KeyValue): Optional<Namespace> {
		const namespace = groups._namespace ?? "";
		const parts = namespace == "" ? [] : namespace.split(".");
		return new Optional<Namespace>({ parts: parts });
	}
}