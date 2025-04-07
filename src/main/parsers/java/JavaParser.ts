import { JavaRegexParser } from "./JavaRegexParser";
import { AbstractParserFile, ParseContent } from "../AbstractParserFile";
import { Encapsulation } from "../../../common/types/encapsulation.types";
import { JavaImportParser } from "./JavaImportParser";
import { Container } from "../../Container";
import { JavaAttributeParser } from "./JavaAttributeParser";
import { IParserFile } from "../../../common/types/interfaces.type";
import { JavaDetailParser } from "./JavaDetailParser";
import { WorkspaceFiles } from "../../../common/types/classes.type";

export class JavaParser extends AbstractParserFile implements IParserFile {

	constructor(workspace: WorkspaceFiles) {
		super({
			detail: new JavaDetailParser(encapsulation),
			methods: new JavaRegexParser(encapsulation),
			imports: new JavaImportParser(workspace),
			attributes: new JavaAttributeParser(encapsulation),
		});
	}
}

const encapsulation = [ 
	Encapsulation.allowed.private,
	Encapsulation.allowed.protected,
	Encapsulation.allowed.public,
];