import { Attribute } from "../../../common/types/backend.type";
import { KeyValue } from "../../../common/types/general.types";
import { IParser } from "../../../common/types/interfaces.type";

export class PhpAttributeParser implements IParser<Attribute> {
	getPatternRegex(): string {
		return "";
	}

	getValue(groups: KeyValue): Attribute | undefined {
		return undefined;
	}
}