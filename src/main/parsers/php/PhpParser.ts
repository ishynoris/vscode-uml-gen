import { Encapsulation } from "../../types/encapsulation.types";
import { IParserFile } from "../../types/parser.type";
import { AbstractParserFile } from "../AbstractParserFile";
import { PhpRegexPareser } from "./PhpRegexParser";

export class PhpParser extends AbstractParserFile implements IParserFile {

	constructor() {
		super(new PhpRegexPareser([
			Encapsulation.allowed.public,
			Encapsulation.allowed.private,
			Encapsulation.allowed.protected,
		]));
	}
}