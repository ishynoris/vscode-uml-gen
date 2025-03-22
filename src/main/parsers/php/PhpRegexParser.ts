import { Args, Encapsulation, IParseMethod } from "../../types/parser.type";
import { AbstractParserMethod, GroupRegex, MetadataRegex } from "../AbstractParserMethod";

enum Regex {
	Blank = `\\s\\t\\n`,
	Letters = `a-zA-Z`,
	Numbers = `0-9`,
	Characters = `$=,\\'\\"\\[\\]|`,
	OpenArgs = `\\(`,
	CloseArgs = `\\)`,

	BlankOpt = `[${Blank}]*`,
	BlankReq = `[${Blank}]+`,
	CloseBlock = `${BlankOpt}{`,
	Name = `[${Letters}${Numbers}_]+`,
	Args = `[${Letters}${Numbers}${Characters}${Blank}]*`,

	Return = `[${Letters}${Numbers}]+`,
}

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
		return `(?<_encapsulation>(${encapsulation}))` 
			+ `(${Regex.BlankReq}static)?`
			+ `${Regex.BlankReq}function`
			+ `${Regex.BlankReq}(?<_name>${Regex.Name})${Regex.BlankOpt}`
			+ `${Regex.OpenArgs}(?<_args>${Regex.Args})${Regex.CloseArgs}`
			+ `${Regex.BlankOpt}(:${Regex.BlankOpt}(?<_return>${Regex.Args}))?${Regex.CloseBlock}`;
	}
}