import { ClassDetail } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { Types } from "../../../common/types/encapsulation.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
import { RegexGroups } from "../ParserFileRegex";

enum Def {
	encap = "_cls_encap",
	sign = "_cls_sign",
	name = "_cls_name",
	any = "_cls_anything",
}

export class PhpDetailParser implements IParser<ClassDetail> {

	constructor (private types: Types[]) {}

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Def.name);
	}

	getPatternRegex(): string {
		const chars = `\\_\\-,`
		const encapsulation = this.types.join("|");
		const signature = `(static class)|(abstract class)|interface|enum|class`
		const name = `[${Regex.Letters}${Regex.Numbers}_]+`
		const anything = `([${Regex.Letters}${Regex.Numbers}${Regex.Blank}${chars}])*`;

		return `(?<${Def.encap}>(${encapsulation})${Regex.BlankReq})?` 
			+ `(?<${Def.sign}>${signature})${Regex.BlankReq}`
			+ `(?<${Def.name}>${name})${Regex.BlankOp}`
			+ `(?<${Def.any}>${anything})${Regex.OpenBlock}`;
	}

	getValue(groups: RegexGroups): Optional<ClassDetail> {
		const signature  = groups.get(Def.sign);
		const name = groups.get(Def.name);
		if (signature == undefined && name == undefined) {
			return new Optional<ClassDetail>();
		}

		const detail: ClassDetail = {
			name: name,
			isInterface: signature.includes("interface"),
			isAbstract: signature.includes("abstract"),
			isStatic: signature.includes("static"),
			isEnum: signature.includes("enum"),
		};
		return new Optional(detail);
	}
}