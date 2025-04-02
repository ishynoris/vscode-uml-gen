import { ClassDetail } from "../../../common/types/backend.type";
import { Allowed } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaDetailParser implements IParser<ClassDetail> {

	constructor(private type: Allowed[]) { }

	getPatternRegex(): string {
		const blankReq = Regex.BlankReq;
		const encapsulation = this.type.join("|");
		const signature = `((static class)|(abstract class)|interface|enum|class)`;
		const name = `[${Regex.Letters}${Regex.Numbers}]+`;
		const anyting = `.*`

		return `(?<_encap>${encapsulation})${Regex.BlankReq}`
			+ `(?<_details>${signature})${Regex.BlankReq}`
			+ `(?<_name>${name})${Regex.BlankOp}`
			+ `(?<_inherit>${anyting})${Regex.OpenBlock}`;
	}

	getValue(groups: KeyValue): ClassDetail | undefined {
		const details = groups._details ?? "";

		return {
			name: groups._name,
			isAbstract: details.includes("abstract"),
			isInterface: details.includes("interface"),
			isStatic: details.includes("static"),
			isEnum: details.includes("enum"),
		};
	}
}
