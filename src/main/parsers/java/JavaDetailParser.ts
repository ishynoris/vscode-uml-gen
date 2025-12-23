import { ClassDetail } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { Allowed } from "../../../common/types/encapsulation.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
import { RegexGroups } from "../ParserFileRegex";

enum Attr {
	encap = "cls_encap",
	details = "cls_details",
	name = "cls_name",
	inherit = "cls_inherit",
}

export class JavaDetailParser implements IParser<ClassDetail> {

	constructor(private type: Allowed[]) { }

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Attr.name);
	}

	getPatternRegex(): string {
		const encapsulation = this.type.join("|");
		const signature = `((static class)|(abstract class)|interface|enum|class)`;
		const name = `[${Regex.Letters}${Regex.Numbers}]+`;

		return `(?<${Attr.encap}>${encapsulation})${Regex.BlankReq}`
			+ `(?<${Attr.details}>${signature})${Regex.BlankReq}`
			+ `(?<${Attr.name}>${name})${Regex.BlankOp}`
			+ `(?<${Attr.inherit}>${Regex.Anything})${Regex.OpenBlock}`;
	}

	getValue(groups: RegexGroups): Optional<ClassDetail> {
		const details = groups.get(Attr.details);

		return new Optional({
			name: groups.get(Attr.name),
			isAbstract: details.includes("abstract"),
			isInterface: details.includes("interface"),
			isStatic: details.includes("static"),
			isEnum: details.includes("enum"),
		});
	}
}
