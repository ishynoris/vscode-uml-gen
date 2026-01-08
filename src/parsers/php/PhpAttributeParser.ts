import { Attribute, Optional, Types, IParser } from "../../common/types";
import { Regex } from "../../main/util";
import { RegexGroups } from "../ParserFileRegex";

enum Def {
	enc = "_attr_encap",
	clss = "_attr_classifier",
	type= "_attr_type",
	name = "_attr_name",
	init = "_attr_initial",
}

export class PhpAttributeParser implements IParser<Attribute> {

	constructor(private types: Types[]) { }

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Def.enc)
			&& groups.has(Def.name)
	}

	getPatternRegex(): string {
		const characters = `\\[\\]_-`

		const encapsulation =  this.types.join("|");
		const classifiverVar = `(final static)|(static final)|final|static`;
		const typeVar = `[${Regex.Letters}${Regex.Numbers}${characters}]+`;
		const nameVar = `\\$[${Regex.Letters}${Regex.Numbers}${characters}]+`;
		const initialVal = `=${Regex.Anything}`;

		return `(?<${Def.enc}>${encapsulation})${Regex.BlankReq}`
			+ `(?<${Def.clss}>${classifiverVar})?${Regex.BlankOp}`
			+ `(?<${Def.type}>${typeVar}${Regex.BlankReq})?`
			+ `(?<${Def.name}>${nameVar}${Regex.BlankOp})`
			+ `(?<${Def.init}>${initialVal})?;`;
	}

	getValue(groups: RegexGroups): Optional<Attribute> {
		const _encap = groups.get(Def.enc)
		const _initial = groups.get(Def.init)
		const _classifier = groups.get(Def.clss)

		const initialVal = _initial.length > 0 ? _initial.replace("=", "").trim() : undefined;

		const attr = {
			name: groups.get(Def.name),
			type: groups.get(Def.type),
			encapsulation: groups.asEncapsulation(Def.enc),
			isStatic: _classifier.includes("static"),
			isFinal: _classifier.includes("final"),
			initialValue: initialVal,
		};
		return new Optional(attr);
	}
}