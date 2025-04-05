import { ClassDetail } from "../../../common/types/backend.type";
import { Types } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class PhpDetailParser implements IParser<ClassDetail> {

	constructor (private types: Types[]) {}

	getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const signature = `(static class)|(abstract class)|interface|enum|class`
		const name = `[${Regex.Letters}${Regex.Numbers}_]+`


		return `(?<_encap>(${encapsulation})${Regex.BlankReq})?` 
			+ `(?<_sign>${signature})${Regex.BlankReq}`
			+ `(?<_name>${name})(${Regex.Anything})${Regex.BlankOp}`
			+ `${Regex.OpenBlock}`;
	}

	getValue(groups: KeyValue): ClassDetail | undefined {
		const signature  = groups._sign;
		return {
			name: groups._name,
			isInterface: signature.includes("interface"),
			isAbstract: signature.includes("abstract"),
			isStatic: signature.includes("static"),
			isEnum: signature.includes("enum"),
		};
	}
}