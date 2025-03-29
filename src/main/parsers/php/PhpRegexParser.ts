import { Args, Encapsulation, IParseMethod } from "../../types/parser.type";
import { Regex } from "../../util";
import { AbstractParserMethod, GroupRegex, MetadataRegex } from "../AbstractParserMethod";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
export class PhpRegexPareser extends AbstractParserMethod implements IParseMethod {

	constructor(private types: Encapsulation[]) {
		super();
	}

	protected getMetadadataRegex(group: GroupRegex): MetadataRegex {
		let returnType = group._return;
		if (returnType != undefined) {
			returnType.replaceAll("\n", "")
				.replaceAll("\t", "")
				.trim();
		}

		return {
			name: group._name,
			args: this.processArgs(group._args),
			return: returnType,
			encapsulation: group._encapsulation
		}
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

	protected getPatternRegex(): string {
		const encapsulation = this.types.join("|");

		const speacialChars = `$=,\\'\\"\\[\\]|`;
		const staticKey = `(${Regex.BlankReq}static)?`;
		const functionKey = `${Regex.BlankReq}function`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const manyArgs = `[${Regex.Letters}${Regex.Numbers}${speacialChars}${Regex.Blank}]`

		return `(?<_encapsulation>(${encapsulation}))` 
			+ `${staticKey}${functionKey}`
			+ `${Regex.BlankReq}(?<_name>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<_args>${manyArgs})${Regex.CloseArgs}`
			+ `${Regex.BlankOp}(:${Regex.BlankOp}(?<_return>${manyArgs}))?${Regex.CloseBlock}`;
	}
}