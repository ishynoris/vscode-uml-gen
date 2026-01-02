import { Namespace } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
import { RegexGroups } from "../ParserFileRegex";

enum Attrs {
	namespace = "_namespace",
}

export class JavaNamespaceParser implements IParser<Namespace> {

	hasRequiredValues(groups: RegexGroups): boolean {
		return true;
	}

	getPatternRegex(): string {
		const namespace = `[${Regex.Letters}${Regex.Numbers}\.-_]+`
		return `package${Regex.BlankReq}(?<${Attrs.namespace}>${namespace});`
	}

	getValue(groups: RegexGroups): Optional<Namespace> {
		const parts = groups.split(".", Attrs.namespace);
		return new Optional<Namespace>({ parts: parts });
	}
}