import { IParserFile } from "../../types/parser.type";
import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile, Encapsulation } from "../AbstractParserFile";


export class JavaParser extends AbstractParserFile implements IParserFile {

	constructor() {
		super(new JavaRegexParser([
			Encapsulation.public, 
			Encapsulation.private, 
			Encapsulation.protected,
		]));
	}
}