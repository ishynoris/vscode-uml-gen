import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile, ParseContent } from "../AbstractParserFile";
import { Encapsulation } from "../../types/encapsulation.types";
import { IParserFile } from "../../types/parser.type";
import { JavaImportParser } from "./JavaImportParser";
import { Container } from "../../Container";
import { JavaAttributeParser } from "./JavaAttributeParser";

export class JavaParser extends AbstractParserFile implements IParserFile {

	constructor() {
		super({
			methods: new JavaRegexParser(encapsulation),
			imports: new JavaImportParser(workspaceFiles),
			attributes: new JavaAttributeParser(encapsulation),
		});
	}
}
const workspaceFiles = Container.init().getWorkspaceFiles();

const encapsulation = [ 
	Encapsulation.allowed.private,
	Encapsulation.allowed.protected,
	Encapsulation.allowed.public,
];