import { Args, Method, Optional, Allowed, IParser } from "../../common/types";
import { Regex } from "../../main/util";
import { RegexGroups } from "../ParserFileRegex";

enum Def { 
	enc = "_mtd_encapsulation",
	name = "_mtd_name",
	args = "_mtd_args",
	ret = "_mtd_return",
}

export class PhpRegexPareser implements IParser<Method> {

	constructor(private types: Allowed[]) {
	}

	hasRequiredValues(groups: RegexGroups): boolean {
		return groups.has(Def.enc)
			&& groups.has(Def.name)
			&& groups.has(Def.args)
			&& groups.has(Def.args)
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");

		const speacialChars = `&$=,\\'\\"\\[\\]|${Regex.Blank}`;
		const classifier = `(${Regex.BlankReq}(static|abstract))?`;
		const functionKey = `${Regex.BlankReq}function`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const manyArgs = `[${Regex.Letters}${Regex.Numbers}${speacialChars}]*`

		return `(?<${Def.enc}>(${encapsulation}))` 
			+ `${classifier}${functionKey}`
			+ `${Regex.BlankReq}(?<${Def.name}>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<${Def.args}>${manyArgs})${Regex.CloseArgs}${Regex.BlankOp}`
			+ `(:${Regex.BlankOp}(?<${Def.ret}>${manyArgs}))?${Regex.OpenBlock}`;
	}

	public getValue(group: RegexGroups): Optional<Method> {
		const returnType = group.get(Def.ret, "void")
			.replaceAll("\n", "")
			.replaceAll("\t", "")
			.trim();
		const args = group.get(Def.args);

		const method = {
			isAbstract: false,
			isStatic: false,
			name: group.get(Def.name),
			args: this.processArgs(args),
			returnType: returnType,
			encapsulation: group.asEncapsulation(Def.enc),
		}
		return new Optional(method);
	}

	private processArgs(argsSignature: string): Args[] {
		const args: Args[] = [];
		if (argsSignature.length == 0) {
			return args;
		}

		const params = argsSignature.split(",");
		return params.map((param: string, i: number, arr: string[]) => {
			let initialValue: string | undefined= undefined,
				type: string | undefined = undefined, 
				name: string = "";

			const indexRecive = param.lastIndexOf("=");
			if (indexRecive > -1) {
				initialValue = param.substring(indexRecive).replace("=", "");
				param = param.substring(0, indexRecive).trim();
			}

			const parts = param.split(" ");
			if (parts.length == 1) {
				name = parts[0];
			} else if (parts.length == 2) {
				type = parts[0];
				name = parts[1];
			}

			return {
				name: name.trim(),
				type: type,
				initialValue: initialValue,
			};
		});
	}
}