import { TextDocument } from "vscode";
import { ClassMetadataResult, IParserFile } from "./parser.type";

const PUBLIC_CLASS = "public class";

export class JavaParser implements IParserFile {
	private content!: string;
	private doc!: TextDocument;
	private result: ClassMetadataResult = {
		optional: { 
			isValid: false,
			value: ClassMatadataMock
		},
		errors: [],
	};

	public parse(doc: TextDocument): ClassMetadataResult {
		this.doc = doc;
		this.content = doc.getText()
			.replaceAll("\n", "")
			.replaceAll("\t", "");
		const className = this.getClassName();


		this.result.optional.isValid = this.result.errors.length == 0;
		return this.result;
	}

	private getClassName(): string {
		const index = this.content.search(PUBLIC_CLASS);
		if (index < 0) {
			this.result.errors.push(`Verifique se o arquivo ${this.doc.fileName} possui uma classe pública`);
			return "";
		}

		const classNameIndex = index + PUBLIC_CLASS.length;
		const classNameEnd = this.content.search("{");
		const className = this.content
			.substring(classNameIndex, classNameEnd)
			.replaceAll(" ", "");
		if (className == null || className.length == 0) {
			this.result.errors.push(`Não foi possível definir o nome da classe: ${this.doc.fileName}`);
		}
		return className;
	}
}

const ClassMatadataMock = {
	className: "",
}