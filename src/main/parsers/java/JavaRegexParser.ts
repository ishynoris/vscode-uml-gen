import { Allowed, Encapsulation } from "../../types/encapsulation.types";
import { Args, IParser, KeyValue, Method } from "../../types/parser.type";
import { Regex } from "../../util";

export class JavaRegexParser  implements IParser<Method> {

	constructor(private types: Allowed[]) {
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const returnKey = `[${Regex.Letters}@<> ,]+`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const args = `[${Regex.Letters}@<> ,]*`;

		return `(?<encapsulation>${encapsulation})${Regex.BlankReq}`
			+ `(?<return>${returnKey})${Regex.BlankReq}`
			+ `(?<name>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<args>${args})${Regex.CloseArgs}${Regex.BlankOp}`
			+ `${Regex.OpenBlock}`;
	}

	public getValue(group: KeyValue): Method {
		return {
			name: group.name,
			returnType: group.return,
			encapsulation: Encapsulation.to(group.encapsulation),
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
}
