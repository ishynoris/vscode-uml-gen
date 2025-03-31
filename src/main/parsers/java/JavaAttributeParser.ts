import { Allowed, Encapsulation } from "../../types/encapsulation.types";
import { Attribute, IParser, KeyValue, Optional } from "../../types/parser.type";
import { Regex } from "../../util";

export class JavaAttributeParser implements IParser<Attribute> {

	constructor(private types: Allowed[]) {
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const typesVar = `[${Regex.Letters}@<> ,]*`;
		const nameVar = `[${Regex.Letters}${Regex.Numbers}_]+`;

		return `(?<encapsulation>${encapsulation})${Regex.BlankReq}`
			+ `(?<type>${typesVar})${Regex.BlankReq}`
			+ `(?<name>${nameVar})${Regex.BlankOp};`;
	}

	public getValue(groups: KeyValue): Attribute | undefined {
		return {
			encapsulation: Encapsulation.to(groups.encapsulation),
			type: groups.type,
			name: groups.name,
		}
	}
}