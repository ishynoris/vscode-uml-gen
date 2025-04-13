import { Attribute } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { Encapsulation, Types } from "../../../common/types/encapsulation.types";
import { Extensions } from "../../../common/types/extension.type";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class PhpAttributeParser implements IParser<Attribute> {

	constructor(private types: Types[]) { }

	hasRequiredValues(groups: KeyValue): boolean {
		return groups._attr_encap != undefined
			&& groups._attr_name != undefined
	}

	getPatternRegex(): string {
		const characters = `\\[\\]_-`

		const encapsulation =  this.types.join("|");
		const classifiverVar = `(final static)|(static final)|final|static`;
		const typeVar = `[${Regex.Letters}${Regex.Numbers}${characters}]+`;
		const nameVar = `\\$[${Regex.Letters}${Regex.Numbers}${characters}]+`;
		const initialVal = `=${Regex.Anything}`;

		return `(?<_attr_encap>${encapsulation})${Regex.BlankReq}`
			+ `(?<_attr_classifier>${classifiverVar})?${Regex.BlankOp}`
			+ `(?<_attr_type>${typeVar}${Regex.BlankReq})?`
			+ `(?<_attr_name>${nameVar}${Regex.BlankOp})`
			+ `(?<_attr_initial>${initialVal})?;`;
	}

	getValue(groups: KeyValue): Optional<Attribute> {
		const _encap = groups._attr_encap ?? "";
		const _initial = groups._attr_initial ?? "";
		const _classifier = groups._attr_classifier ?? "";

		const initialVal = _initial.length > 0 ? _initial.replace("=", "").trim() : undefined;

		const attr = {
			name: groups._attr_name,
			type: groups._attr_type ?? "",
			encapsulation: Encapsulation.to(_encap.length > 0 ? _encap : undefined),
			isStatic: _classifier.includes("static"),
			isFinal: _classifier.includes("final"),
			initialValue: initialVal,
		};
		return new Optional(attr);
	}
}