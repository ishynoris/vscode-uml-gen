import { Method, Optional } from "../../types/parser.type";
import { Mock } from "../../types/mock.types";

export const types = {
	public: "public",
	private: "private",
}


export class MethodJavaParser {
	private signature!: string;
	private result: Optional<Method>;

	constructor (private type: string) {
		this.result = Mock.getMethodResult();
		this.result.value.encapsulation = type;
	}

	public parse(signature: string): Optional<Method> {
		this.signature = signature
			.replace(this.type, "")
			.replaceAll(", ", ",")
			.trim();

		this.consumeArgs();
		this.consumeName();
		this.consumeReturn();

		this.result.isValid = this.isValid();
		return this.result;
	}

	private consumeName() {
		const index = this.signature.lastIndexOf(" ");
		let name = this.signature.substring(index);
		if (name.length == 0) {
			this.addError("Não foi possível identificar o nome do método");
		}

		this.result.value.name = name.trim();
		this.signature = this.signature.substring(0, index);
	}

	private consumeReturn() {
		let returnType = this.signature;
		if (returnType.length == 0) {
			this.addError("Não foi possível identificar o tipo de retorno");
		}

		this.result.value.returnType = returnType;
	}

	private consumeArgs() {
		const begin = this.signature.indexOf("(");
		const end = this.signature.indexOf(")");
		let params = this.signature.substring(begin + 1, end);

		this.signature = this.signature.substring(0, begin);

		if (params.length == 0) {
			return;
		}

		params = this.processGeneric(params);

		const args = params.split(",");
		for (const key in args) {
			const arg = args[key].split(" ");
			this.addArg(arg[0], arg[1]);
		}
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

	private addArg(type: string, name: string) {
		type = type.replaceAll("{", "<")
			.replaceAll("}", ">")
			.replaceAll("|", ",");

		this.result.value.args.push({
			name: name,
			type: type,
		})
	}

	private addError(error: string) {
		this.result.errors.push(error);
	}

	private isValid(): boolean {
		const hasNoErrors = this.result.errors.length == 0;
		const hasName = this.result.value.name.length > 0;
		const hasReturn = this.result.value.returnType.length > 0;
		return hasNoErrors && hasName && hasReturn;
	}
}

