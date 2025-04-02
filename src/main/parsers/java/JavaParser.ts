import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile, ParseContent } from "../AbstractParserFile";
import { Encapsulation } from "../../../common/types/encapsulation.types";
import { JavaImportParser } from "./JavaImportParser";
import { Container } from "../../Container";
import { JavaAttributeParser } from "./JavaAttributeParser";
import { IParserFile } from "../../../common/types/interfaces.type";
import { JavaDetailParser } from "./JavaDetailParser";

export class JavaParser extends AbstractParserFile implements IParserFile {

	constructor() {
		super({
			detail: new JavaDetailParser(encapsulation),
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