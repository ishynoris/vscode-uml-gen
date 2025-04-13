import { ClassDetail } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { Types } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class PhpDetailParser implements IParser<ClassDetail> {

	constructor (private types: Types[]) {}

	hasRequiredValues(groups: KeyValue): boolean {
		return groups._cls_name != undefined;
	}

	getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const signature = `(static class)|(abstract class)|interface|enum|class`
		const name = `[${Regex.Letters}${Regex.Numbers}_]+`

		return `(?<_cls_encap>(${encapsulation})${Regex.BlankReq})?` 
			+ `(?<_cls_sign>${signature})${Regex.BlankReq}`
			+ `(?<_cls_name>${name})(${Regex.Anything})${Regex.BlankOp}`
			+ `${Regex.OpenBlock}`;
	}

	getValue(groups: KeyValue): Optional<ClassDetail> {
		const signature  = groups._cls_sign;
		const name = groups._cls_name;
		if (signature == undefined && name == undefined) {
			return new Optional<ClassDetail>();
		}

		const method = {
			name: groups._cls_name,
			isInterface: signature.includes("interface"),
			isAbstract: signature.includes("abstract"),
			isStatic: signature.includes("static"),
			isEnum: signature.includes("enum"),
		};
		return new Optional(method);
	}
}