import { Types as Allowed } from "../../types/encapsulation.types";
import { Mock } from "../../types/mock.types";
import { Attribute, IParserFile, Package } from "../../types/parser.type";
import { AbstractParserFile, ParseContent } from "../AbstractParserFile";
import { PhpRegexPareser } from "./PhpRegexParser";

export class PhpParser extends AbstractParserFile implements IParserFile {

	constructor() {
		super(Parsers);
	}
}

const encapsulation = [ Allowed.public, Allowed.private, Allowed.protected ]

const Parsers: ParseContent = {
	methods: new PhpRegexPareser(encapsulation),
	imports: Mock.getParserContent<Package>(),
	attributes: Mock.getParserContent<Attribute>(),
}