import { Args, Method } from "../../../common/types/backend.type";
import { Optional } from "../../../common/types/classes.type";
import { Allowed, Encapsulation } from "../../../common/types/encapsulation.types";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";
import { Regex } from "../../util";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
export class PhpRegexPareser implements IParser<Method> {

	constructor(private types: Allowed[]) {
	}

	hasRequiredValues(groups: KeyValue): boolean {
		return groups._mtd_encapsulation != undefined
			&& groups._mtd_name != undefined
			&& groups._mtd_args != undefined
			&& groups._mtd_return != undefined
	}

	public getPatternRegex(): string {
		const encapsulation = this.types.join("|");

		const speacialChars = `&$=,\\'\\"\\[\\]|${Regex.Blank}`;
		const classifier = `(${Regex.BlankReq}(static|abstract))?`;
		const functionKey = `${Regex.BlankReq}function`;
		const methodName = `[${Regex.Letters}${Regex.Numbers}_]+`;
		const manyArgs = `[${Regex.Letters}${Regex.Numbers}${speacialChars}]*`

		return `(?<_mtd_encapsulation>(${encapsulation}))` 
			+ `${classifier}${functionKey}`
			+ `${Regex.BlankReq}(?<_mtd_name>${methodName})${Regex.BlankOp}`
			+ `${Regex.OpenArgs}(?<_mtd_args>${manyArgs})${Regex.CloseArgs}${Regex.BlankOp}`
			+ `(:${Regex.BlankOp}(?<_mtd_return>${manyArgs}))?${Regex.OpenBlock}`;
	}

	public getValue(group: KeyValue): Optional<Method> {
		const returnType = (group._mtd_return ?? "void")
			.replaceAll("\n", "")
			.replaceAll("\t", "")
			.trim();

		const method = {
			isAbstract: false,
			isStatic: false,
			name: group._mtd_name,
			args: this.processArgs(group._mtd_args),
			returnType: returnType,
			encapsulation: Encapsulation.to(group._mtd_encapsulation)
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