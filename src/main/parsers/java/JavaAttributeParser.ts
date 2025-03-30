import { Attribute, IParser, KeyValue, Optional } from "../../types/parser.type";

export class JavaAttributeParser implements IParser<Attribute> {

	parse(content: string): Optional<Attribute[]> {
		
		
		return new Optional();
	}

	public getPatternRegex(): string {
		return "";
	}

	public getValue(groups: KeyValue): Attribute | undefined {
		return undefined;
	}
}