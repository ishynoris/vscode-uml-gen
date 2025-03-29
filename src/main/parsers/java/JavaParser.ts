import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile, Parsers } from "../AbstractParserFile";
import { Allowed, Encapsulation, Types } from "../../types/encapsulation.types";
import { IParseImport, IParseMethod, IParserFile } from "../../types/parser.type";
import { JavaImportParser } from "./JavaImportParser";

export class JavaParser extends AbstractParserFile implements IParserFile {

	private types: Allowed[] = [];

	constructor() {
		super(JavaParsers);
	}
}

const encapsulation = [ 
	Encapsulation.allowed.private,
	Encapsulation.allowed.protected,
	Encapsulation.allowed.public,
]

const JavaParsers: Parsers = {
	importParser: new JavaImportParser,
	methodParser: new JavaRegexParser(encapsulation),
}