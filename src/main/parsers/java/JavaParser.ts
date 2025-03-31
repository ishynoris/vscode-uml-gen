import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile, ParseContent } from "../AbstractParserFile";
import { Encapsulation } from "../../../common/types/encapsulation.types";
import { JavaImportParser } from "./JavaImportParser";
import { Container } from "../../Container";
import { JavaAttributeParser } from "./JavaAttributeParser";
import { IParserFile } from "../../../common/types/interfaces.type";

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