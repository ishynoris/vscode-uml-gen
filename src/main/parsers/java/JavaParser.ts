import { 
	ClassMetadata, 
	FileMetadata, 
	IParserFile, 
	Method, 
	Optional 
} from "../../types/parser.type";
import { Mock } from "../../types/mock.types";
import { JavaRegexParser } from "./JavaRegexParser";

export enum Encapsulation {
	public = "public", 
	private = "private", 
	protected = "protected"
}

export class JavaParser implements IParserFile {
	private content!: string;
	private doc!: FileMetadata;

	private result: Optional<ClassMetadata>;

	constructor() {
		this.result = Mock.getClassMetadataResult();
	}

	public parse(doc: FileMetadata): Optional<ClassMetadata> {
		this.doc = doc;
		this.content = doc.content;

		this.defineClassName();
		this.defineMethod(Encapsulation.public);
		this.defineMethod(Encapsulation.private);

		this.result.isValid = this.result.errors.length == 0;
		return this.result;
	}

	private defineClassName() {
		const search = `.${this.doc.extension}`;
		const className = this.doc.name.replace(search, "");
		this.result.value.className = className;
	}

	private defineMethod(type: Encapsulation) {
		const regexParser = new JavaRegexParser(type);
		const methodOpt = regexParser.parse(this.content);

		this.result.errors.push(...methodOpt.errors);
		this.result.value.methods.push(...methodOpt.value);
	}
}