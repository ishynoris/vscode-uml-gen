import { ClassDetail } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { Allowed } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaDetailParser implements IParser<ClassDetail> {

	constructor(private type: Allowed[]) { }

	hasRequiredValues(groups: KeyValue): boolean {
		return groups.cls_name != undefined;
	}

	getPatternRegex(): string {
		const encapsulation = this.type.join("|");
		const signature = `((static class)|(abstract class)|interface|enum|class)`;
		const name = `[${Regex.Letters}${Regex.Numbers}]+`;

		return `(?<cls_encap>${encapsulation})${Regex.BlankReq}`
			+ `(?<cls_details>${signature})${Regex.BlankReq}`
			+ `(?<cls_name>${name})${Regex.BlankOp}`
			+ `(?<cls_inherit>${Regex.Anything})${Regex.OpenBlock}`;
	}

	getValue(groups: KeyValue): Optional<ClassDetail> {
		const details = groups.cls_details ?? "";

		return new Optional({
			name: groups.cls_name,
			isAbstract: details.includes("abstract"),
			isInterface: details.includes("interface"),
			isStatic: details.includes("static"),
			isEnum: details.includes("enum"),
		});
	}
}
