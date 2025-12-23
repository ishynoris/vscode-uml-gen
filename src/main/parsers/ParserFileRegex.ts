import { Allowed, Encapsulation } from "../../common/types/encapsulation.types";
import { KeyValue } from "../../common/types/general.types";
import { IParserFile } from "../../common/types/interfaces.type";

export class ParserFileRegex {

	private regex: RegExp;
	private currentExpression: null | RegExpExecArray;

	constructor(private source: string, parser: IParserFile) {
		const regexNamespace = parser.getNamespacePareser().getPatternRegex();
		const regexDetail = parser.getDetailParser().getPatternRegex();
		const regexAttribute = parser.getAttributeParser().getPatternRegex();
		const regexMethod = parser.getMethodParser().getPatternRegex();
		const regexImport = parser.getImportParser().getPatternRegex();

		const pattern = `(${regexNamespace})|(${regexDetail})|(${regexImport})|(${regexAttribute})|(${regexMethod})`;

		this.regex = new RegExp(pattern, "gi");
		this.currentExpression = null;
	}

	public hasNextExpression(): boolean {
		this.currentExpression = this.regex.exec(this.source);
		return this.currentExpression != null;
	}

	public getExpression(): RegexGroups {
		const groups = this.currentExpression?.groups;
		return new RegexGroups(groups);
	}
	
	public getCurrentSource(): string {
		return this.regex.source;
	}
}

export class RegexGroups {
	constructor(private map: KeyValue | undefined) {
	}

	public has(key: string): boolean {
		if (this.map == undefined) {
			return false;
		}
		return this.map[key] != undefined;
	}

	public get(key: string, defValue: string = ""): string {
		if (this.map == undefined) {
			return defValue;
		}
		return this.map[key] ?? defValue;
	}

	public split(split: string, key: string, defValue: string = ""): string[] {
		const value = this.get(key, defValue);
		return value == "" ? [] : value.split(split);
	}

	public asEncapsulation(key: string): Allowed {
		const value = this.get(key);
		return Encapsulation.to(value);
	}
}