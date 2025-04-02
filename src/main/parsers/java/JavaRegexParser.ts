import { Args, Method } from "../../../common/types/backend.type";
import { Allowed, Encapsulation } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";

export class JavaRegexParser  implements IParser<Method> {

	constructor(private types: Allowed[]) {
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");
		const detail = `((static abstract)|(abstract static)|static|abstract)?`
		const returnKey = `[${Regex.Letters}\\[\\]@<> ,]+`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const args = `[${Regex.Letters}\\[\\]@<> ,]*`;

		return `(?<encapsulation>${encapsulation})${Regex.BlankReq}`
			+ `(?<detail>${detail})${Regex.BlankOp}`
			+ `(?<return>${returnKey})${Regex.BlankReq}`
			+ `(?<name>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<args>${args})${Regex.CloseArgs}${Regex.BlankOp}`
			+ `${Regex.Anything}${Regex.OpenBlock}`;
	}

	public getValue(group: KeyValue): Method {
		const detail = group.detail;

		return {
			name: group.name,
			isAbstract: detail.includes("abstract"),
			isStatic: detail.includes("static"),
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
