import { Encapsulation, Allowed } from "../types/encapsulation.types";
import { Mock } from "../types/mock.types";
import { Args, IParseMethod, Method, Optional } from "../types/parser.type";


export type GroupRegex = { [ key: string ]: string };

export type MetadataRegex = {
	name: string,
	return: string,
	encapsulation: string,
	args: Args[],
}

export abstract class AbstractParserMethod implements IParseMethod {

	protected abstract getMetadadataRegex(groups: GroupRegex): MetadataRegex;

	protected abstract getPatternRegex(): string;

	public parse(content: string): Optional<Method[]> {
		let expression;
		const errors: string[] = [];
		const methods: Method[] = [];
		
		const regex = new RegExp(this.getPatternRegex(), "gi");
		while ((expression = regex.exec(content)) != null) {
			const signature = expression[0];
			if (expression.groups == undefined) {
				errors.push(`Cannot process signature "${signature}"`);
				continue;
			}

			const regexData = this.getMetadadataRegex(expression.groups);
			const validator = new ValidateGroups(signature);
			validator.validate(regexData);
			if (validator.hasErrors()) {
				errors.push(...validator.getErrors());
				continue;
			} 

			methods.push({
				name: regexData.name,
				encapsulation: Encapsulation.to(regexData.encapsulation),
				returnType: regexData.return,
				args: regexData.args,
			});
		}

		return {
			isValid: errors.length == 0,
			errors: errors,
			value: methods,
		}
	}
}


class ValidateGroups {

	private signature: string;
	private errors: string[];
	private method!: Method;

	constructor(signature: string) { 
		this.signature = signature;
		this.errors = [];
		this.method = Mock.getMethodResult().value;
	}

	public validate(metada: MetadataRegex) {
		this.validateName(metada.name);
		this.validateEncapsulation(metada.encapsulation);
		return this.errors;
	}

	public hasErrors(): boolean {
		return this.errors.length > 0;
	}

	public getErrors(): string[] {
		return this.errors;
	}

	private validateName(name: string) {
		if (name == undefined || name.length == 0) {
			this.errors.push(`No name defined in ${this.signature}`);
			return;
		}

		this.method.name = name;
	}

	private validateEncapsulation(encapsulation: string) {
		if (Encapsulation.isValid(encapsulation)) {
			this.method.encapsulation = Encapsulation.to(encapsulation);
			return;
		}

		this.errors.push(`Cannot process encapsulation "${encapsulation}" in "${this.signature}"`);
	}
}
