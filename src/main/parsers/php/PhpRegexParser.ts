import { Args, Method } from "../../../common/types/backend.type";
import { Allowed, Encapsulation } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
export class PhpRegexPareser implements IParser<Method> {

	constructor(private types: Allowed[]) {
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");

		const speacialChars = `&$=,\\'\\"\\[\\]|${Regex.Blank}`;
		const classifier = `(${Regex.BlankReq}(static|abstract))?`;
		const functionKey = `${Regex.BlankReq}function`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const manyArgs = `[${Regex.Letters}${Regex.Numbers}${speacialChars}]*`

		return `(?<_encapsulation>(${encapsulation}))` 
			+ `${classifier}${functionKey}`
			+ `${Regex.BlankReq}(?<_name>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<_args>${manyArgs})${Regex.CloseArgs}${Regex.BlankOp}`
			+ `(:${Regex.BlankOp}(?<_return>${manyArgs}))?${Regex.OpenBlock}`;
	}

	public getValue(group: KeyValue): Method {
		const returnType = (group._return ?? "void")
			.replaceAll("\n", "")
			.replaceAll("\t", "")
			.trim();

		return {
			isAbstract: false,
			isStatic: false,
			name: group._name,
			args: this.processArgs(group._args),
			returnType: returnType,
			encapsulation: Encapsulation.to(group._encapsulation)
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
}