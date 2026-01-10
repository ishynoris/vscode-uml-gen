import { Attribute, EncapsulationAllowed as Allowed, IParser,  Optional } from "../../common/types";
import { Regex } from "../../main/util";
import { RegexGroups } from "../ParserFileRegex";

enum Def {
	encapsulation = "attr_encapsulation",
	classifier = "attr_classifier",
	type = "attr_type",
	name = "attr_name",
	initial = "attr_initial",
}

export class JavaAttributeParser implements IParser<Attribute> {

	constructor(private types: Allowed[]) {
	}

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Def.encapsulation)
			&& groups.has(Def.type)
			&& groups.has(Def.name)
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const classifier = `(final static)|(static final)|final|static`
		const typesVar = `[${Regex.Letters}@<> ,]*`;
		const nameVar = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const initialVal = `=${Regex.Anything}`;

		return `(?<${Def.encapsulation}>${encapsulation})${Regex.BlankReq}`
			+ `(?<${Def.classifier}>${classifier})?${Regex.BlankOp}`
			+ `(?<${Def.type}>${typesVar})${Regex.BlankReq}`
			+ `(?<${Def.name}>${nameVar})${Regex.BlankOp}`
			+ `(?<${Def.initial}>${initialVal})?;`;
	}

	public getValue(groups: RegexGroups): Optional<Attribute> {
		const classifier = groups.get(Def.classifier, "");

		return new Optional({
			encapsulation: groups.asEncapsulation(Def.encapsulation),
			type: groups.get(Def.type),
			name: groups.get(Def.name),
			isFinal: classifier.includes("final"),
			isStatic: classifier.includes("static"),
			initialValue: groups.get(Def.initial),
		});
	}
}