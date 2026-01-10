import { Args, Method, Optional, EncapsulationAllowed as Allowed, IParser } from "../../common/types";
import { Regex } from "../../main/util";
import { RegexGroups } from "../ParserFileRegex";

enum Attrs {
	encapsulation = "method_encapsulation",
	detail = "method_detail",
	return = "method_return",
	name = "method_name",
	args = "method_args",
}

export class JavaRegexParser  implements IParser<Method> {

	constructor(private types: Allowed[]) {
	}

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Attrs.encapsulation)
			&& groups.has(Attrs.return)
			&& groups.has(Attrs.name);
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const detail = `((static abstract)|(abstract static)|static|abstract)?`
		const returnKey = `[${Regex.Letters}\\[\\]@<> ,]+`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const args = `[${Regex.Letters}\\[\\]@<> ,]*`;

		return `(?<${Attrs.encapsulation}>${encapsulation})${Regex.BlankReq}`
			+ `(?<${Attrs.detail}>${detail})${Regex.BlankOp}`
			+ `(?<${Attrs.return}>${returnKey})${Regex.BlankReq}`
			+ `(?<${Attrs.name}>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<${Attrs.args}>${args})${Regex.CloseArgs}${Regex.BlankOp}`
			+ `${Regex.Anything}${Regex.OpenBlock}`;
	}

	public getValue(group: RegexGroups): Optional<Method> {
		const detail = group.get(Attrs.detail);
		const args = group.get(Attrs.args);

		return new Optional<Method>({
			name: group.get(Attrs.name),
			isAbstract: detail.includes("abstract"),
			isStatic: detail.includes("static"),
			returnType: group.get(Attrs.return),
			encapsulation: group.asEncapsulation(Attrs.encapsulation),
			args: this.processArgs(args),
		});
	}

	private processArgs(params: string): Args[] {
		const argsResult: Args[] = [];

		params = this.processGeneric(params ?? "");
		if (params.length == 0) {
			return argsResult;
		}

		const args: string[] = params.split(",");
		for (const key in args) {
			const arg = args[key];
			const blankIndex = arg.lastIndexOf(" ");
			const type = arg.substring(0, blankIndex);
			const name = arg.substring(blankIndex);
			
			argsResult.push(this.consumeArg(type, name));
		}
		return argsResult;
	}

	private processGeneric(params: string): string {
		const genericEnd = params.indexOf(">");
		const genericBegin = params.substring(0, genericEnd).lastIndexOf("<");
		if (genericBegin < 0 && genericEnd < 0) {
			return params;
		}

		const generic = params.substring(genericBegin, genericEnd + 1)
			.replaceAll(",", "|")
			.replaceAll("<", "{")
			.replaceAll(">", "}");
		params = "".concat(
			params.substring(0, genericBegin), 
			generic,
			params.substring(genericEnd + 1)
		);

		return this.processGeneric(params);
	}

	private consumeArg(type: string, name: string): Args {
		type = type.replaceAll("{", "<")
			.replaceAll("}", ">")
			.replaceAll("|", ",");
		return { 
			name: name.trim(), 
			type: type.trim(), 
		}
	}
}
