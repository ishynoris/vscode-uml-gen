import { Attribute } from "../../../common/types/backend.type";
import { Encapsulation, Types } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class PhpAttributeParser implements IParser<Attribute> {

	constructor(private types: Types[]) { }

	getPatternRegex(): string {
		const characters = `\\[\\]_-`

		const encapsulation =  this.types.join("|");
		const classifiverVar = `(final static)|(static final)|final|static`;
		const typeVar = `[${Regex.Letters}${Regex.Numbers}${characters}]+`;
		const nameVar = `\\$[${Regex.Letters}${Regex.Numbers}${characters}]+`;
		const initialVal = `=${Regex.Anything}`;

		return `(?<_encap>${encapsulation})${Regex.BlankReq}`
			+ `(?<_classifier>${classifiverVar})?${Regex.BlankOp}`
			+ `(?<_type>${typeVar}${Regex.BlankReq})?`
			+ `(?<_name>${nameVar}${Regex.BlankOp})`
			+ `(?<_initial>${initialVal})?;`;
	}

	getValue(groups: KeyValue): Attribute | undefined {
		const hasEncapsulation = groups._encap != undefined && groups._encap.length > 0;
		const encapsulation = hasEncapsulation ? groups._encap : undefined;
		const classifier = groups._classifier ?? "";

		return {
			name: groups._name,
			type: groups._type ?? "",
			encapsulation: Encapsulation.to(encapsulation),
			isStatic: classifier.includes("static"),
			isFinal: classifier.includes("final"),
		};
	}
}