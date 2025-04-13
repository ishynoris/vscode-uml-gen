import { KeyValue } from "../../../common/types/general.types";
import { Attribute } from "../../../common/types/backend.type";
import { Allowed, Encapsulation } from "../../../common/types/encapsulation.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
import { Optional } from "../../../common/types/classes.type";

export class JavaAttributeParser implements IParser<Attribute> {

	constructor(private types: Allowed[]) {
	}

	hasRequiredValues(groups: KeyValue): boolean {
		return groups.attr_encapsulation != undefined
			&& groups.attr_type != undefined
			&& groups.attr_name != undefined
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const classifier = `(final static)|(static final)|final|static`
		const typesVar = `[${Regex.Letters}@<> ,]*`;
		const nameVar = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const initialVal = `=${Regex.Anything}`;

		return `(?<attr_encapsulation>${encapsulation})${Regex.BlankReq}`
			+ `(?<attr_classifier>${classifier})?${Regex.BlankOp}`
			+ `(?<attr_type>${typesVar})${Regex.BlankReq}`
			+ `(?<attr_name>${nameVar})${Regex.BlankOp}`
			+ `(?<attr_initial>${initialVal})?;`;
	}

	public getValue(groups: KeyValue): Optional<Attribute> {
		const classifier = groups.attr_classifier ?? "";

		return new Optional({
			encapsulation: Encapsulation.to(groups.attr_encapsulation),
			type: groups.type,
			name: groups.name,
			isFinal: classifier.includes("final"),
			isStatic: classifier.includes("static"),
			initialValue: groups.attr_initial ?? "",
		});
	}
}