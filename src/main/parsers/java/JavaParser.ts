import { TextDocument } from "vscode";
import { ClassMetadata, ClassMetadataResult, IParserFile } from "../parser.type";
import { urlToHttpOptions } from "url";
import { MethodJavaParser, types } from "./MehtodJavaParser";
import { Mock } from "../mock.types";

const PUBLIC_CLASS = "public class";

export class JavaParser implements IParserFile {
	private content!: string;
	private doc!: TextDocument;
	private bodyClassIndex!: number;
	private bodyClassEnd!: number;

	private result: ClassMetadataResult;

	constructor() {
		this.result = Mock.geClassMetadataResult();
	}

	public parse(doc: TextDocument): ClassMetadataResult {
		this.doc = doc;
		this.content = doc.getText()
			.replaceAll("\n", "")
			.replaceAll("\t", "");
		this.bodyClassIndex = this.content.search("{");
		this.bodyClassEnd = this.content.lastIndexOf("}");

		this.defineClassName();
		this.defineMethod(types.public);
		this.defineMethod(types.private);

		this.result.optional.isValid = this.result.errors.length == 0;
		return this.result;
	}

	private defineClassName() {
		const index = this.content.search(PUBLIC_CLASS);
		if (index < 0) {
			this.addError(`Verifique se o arquivo ${this.doc.fileName} possui uma classe pública`);
			return;
		}

		if (this.bodyClassIndex < 0) {
			this.addError("Verifique se a classe está formatada corretamente");
			return;
		}

		const classNameIndex = index + PUBLIC_CLASS.length;
		const className = this.content.substring(classNameIndex, this.bodyClassIndex).replaceAll(" ", "");

		if (className.length == 0) {
			this.addError(`Não foi possível definir o nome da classe: ${this.doc.fileName}`);
			return;
		}

		this.result.optional.value.className = className;
	}

	private defineMethod(type: string) {
		let index = this.bodyClassIndex + 1;
		let stop = false;
		while (!stop) {
			const signatureIndex = this.content.indexOf(type, index);
			if (signatureIndex < 0) {
				stop = true;
				continue;
			}
			
			const signatureEnd = this.content.indexOf("{", signatureIndex);
			index = signatureEnd;
			stop = index >= this.bodyClassEnd;

			const signature = this.content.substring(signatureIndex, signatureEnd);
			if (signature.includes("class")) {
				continue;
			}

			const methodParser = new MethodJavaParser(type);
			const result = methodParser.parse(signature.trim());
			if (!result.optional.isValid) {
				continue;
			}

			this.result.optional.value.publicMethod.push(result.optional.value);
		}
	}

	private addError(error: string) {
		this.result.errors.push(error);
	}
}