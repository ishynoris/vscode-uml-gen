import { Args, Encapsulation, IParseMethod } from "../../types/parser.type";
import { Regex } from "../../util";
import { AbstractParserMethod, GroupRegex, MetadataRegex } from "../AbstractParserMethod";

export class JavaRegexParser extends AbstractParserMethod implements IParseMethod {

	constructor(private types: Encapsulation[]) {
		super();
	}

	protected getMetadadataRegex(group: GroupRegex): MetadataRegex {
		return {
			name: group.name,
			return: group.return,
			encapsulation: group.encapsulation,
			args: this.processArgs(group.args),
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

	protected getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const returnKey = `[${Regex.Letters}@<> ,]+`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const args = `[${Regex.Letters}@<> ,]*`;

		return `(?<encapsulation>${encapsulation})${Regex.Blank}`
			+ `(?<return>${returnKey})${Regex.Blank}`
			+ `(?<name>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<args>${args})${Regex.CloseArgs}`
			+ `${Regex.CloseBlock}`;
	}
}
