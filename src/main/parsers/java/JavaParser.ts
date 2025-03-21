import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile } from "../AbstractParserFile";
import { Encapsulation } from "../../types/encapsulation.types";
import { IParserFile } from "../../types/parser.type";


export class JavaParser extends AbstractParserFile implements IParserFile {

	constructor() {
		super(new JavaRegexParser([
			Encapsulation.allowed.private,
			Encapsulation.allowed.protected,
			Encapsulation.allowed.public,
		]));
	}
}