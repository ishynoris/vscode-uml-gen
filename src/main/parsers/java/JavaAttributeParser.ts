import { KeyValue } from "../../../common/types/general.types";
import { Attribute } from "../../../common/types/backend.type";
import { Allowed, Encapsulation } from "../../../common/types/encapsulation.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaAttributeParser implements IParser<Attribute> {

	constructor(private types: Allowed[]) {
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const classifier = `(final static)|(static final)|final|static`
		const typesVar = `[${Regex.Letters}@<> ,]*`;
		const nameVar = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const initialVal = `=${Regex.Anything}`;

		return `(?<encapsulation>${encapsulation})${Regex.BlankReq}`
			+ `(?<classifier>${classifier})?${Regex.BlankOp}`
			+ `(?<type>${typesVar})${Regex.BlankReq}`
			+ `(?<name>${nameVar})${Regex.BlankOp}`
			+ `(?<initial>${initialVal})?;`;
	}

	public getValue(groups: KeyValue): Attribute | undefined {
		const classifier = groups.classifier ?? "";

		return {
			encapsulation: Encapsulation.to(groups.encapsulation),
			type: groups.type,
			name: groups.name,
			isFinal: classifier.includes("final"),
			isStatic: classifier.includes("static"),
			initialValue: groups.initial ?? "",
		}
	}
}