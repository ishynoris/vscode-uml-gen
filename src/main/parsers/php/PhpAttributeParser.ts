import { Attribute } from "../../../common/types/backend.type";
import { Encapsulation, Types } from "../../../common/types/encapsulation.types";
import { Extensions } from "../../../common/types/extension.type";
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
		const _encap = (groups._encap ?? "");
		const _initial = (groups._initial ?? "");

		const classifier = groups._classifier ?? "";
		const initialVal = _initial.length > 0 ? _initial.replace("=", "").trim() : undefined;

		return {
			name: groups._name,
			type: groups._type ?? "",
			encapsulation: Encapsulation.to(_encap.length > 0 ? _encap : undefined),
			isStatic: classifier.includes("static"),
			isFinal: classifier.includes("final"),
			initialValue: initialVal,
		};
	}
}