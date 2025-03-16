import { Args, IParseMethod, Method, Optional } from "../../types/parser.type";
import { Encapsulation } from "../AbstractParserFile";

enum Regex {
	CloseBlock = ".*\\{",
	OpenArgs = "\\(",
	CloseArgs = "\\)",
	Blank = "\\s",
	BlankOpt = "\\s?",
	Name = "[a-zA-Z0-9_]+",
	Return = "[a-zA-Z@<> ,]+",
	Args = "[a-zA-Z@<> ,]*",
}

export class JavaRegexParser implements IParseMethod {

	private regex: RegExp;

	constructor(types: Encapsulation[]) {
		this.regex = this.createRegex(types);
	}

	public parse(content: string): Optional<Method[]> {
		let expression;
		const errors: string[] = [];
		const methods: Method[] = [];

		while ((expression = this.regex.exec(content)) != null) {
			const groups = expression.groups;
			if (groups == undefined) {
				const signature = expression[0];
				errors.push(`Cannot process ${signature}`);
				continue;
			}

			methods.push({
				encapsulation: groups.encapsulation,
				name: groups.name,
				returnType: groups.return,
				args: this.processArgs(groups.args ?? ""),
			})
		}

		return {
			isValid: errors.length == 0,
			errors: errors,
			value: methods,
		}
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

	private createRegex(types: Encapsulation[]): RegExp {
		const encapsulation = types.join("|");
		const regexPattrn = `(?<encapsulation>${encapsulation})${Regex.Blank}`
				+ `(?<return>${Regex.Return})${Regex.Blank}`
				+ `(?<name>${Regex.Name})${Regex.BlankOpt}`
				+ `${Regex.OpenArgs}(?<args>${Regex.Args})${Regex.CloseArgs}`
				+ `${Regex.CloseBlock}`;
		return new RegExp(regexPattrn, "gi");
	}
}
