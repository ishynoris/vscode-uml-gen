import { Namespace } from "../../common/types/backend.type";
import { Optional } from "../../common/types/classes.type";
import { IParser } from "../../common/types/interfaces.type";
import { Regex } from "../../main/util";
import { RegexGroups } from "../ParserFileRegex";

enum Def {
	namespace = "_namespace",
}

export class PhpNamespaceParser implements IParser<Namespace> {

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Def.namespace);
	}
	
	getPatternRegex(): string {
		const chars = `\\\\-_`
		const namespacePatter = `[${Regex.Letters}${Regex.Numbers}${chars}]+`
		return `namespace${Regex.BlankReq}(?<_namespace>${namespacePatter});`
	}

	getValue(groups: RegexGroups): Optional<Namespace> {
		const namespace = groups.get(Def.namespace);
		const parts = namespace == "" ? [] : namespace.split("\\");
		return new Optional<Namespace>({ parts: parts });
	}
}