import { Args, Attribute, ClassMetadata, FileMetadata, Method } from "./backend.type";
import { Encapsulation } from "./encapsulation.types";
import { FileFactory, Front as FrontEnd, Workspace } from "../../main/util";
import { Area } from "./frontend.type";
import { ItalicTemplate } from "../../front/core/templates/ItalicTemplate";
import { IPackageMapper } from "./interfaces.type";

export class Optional<T> {

	public readonly hasValue!: boolean;
	public readonly hasErrors!: boolean;
	public readonly isValid!: boolean;

	constructor(
		public readonly value?: T, 
		public readonly errors: string[] = []
	) { 
		this.hasValue = value != undefined;
		this.hasErrors = errors.length > 0;
		this.isValid = this.hasValue && !this.hasErrors;
	}

	public getMessage(prefixError: string = ""): string {
		return this.errors.reduce((err, msg) => msg += `${prefixError} ${err}`);
	}
}

type MapFileMetada = { [key: string]: FileMetadata };

export class WorkspaceFiles {

	private files: MapFileMetada = { };

	constructor(private extension: string, files: FileMetadata[]) {
		const ReducePath = (map: MapFileMetada, file: FileMetadata): MapFileMetada => {
			map[file.name] = file;
			return map;
		}

		this.files = files.reduce(ReducePath, { });
	}

	getFromPath(absolutePath: string): FileMetadata | undefined {
		return FileFactory.fromAbsolutePath(absolutePath);
	}

	hasFileName(fileName: string): boolean {
		const file = this.getFromFileName(fileName);
		return file != undefined;
	}

	getFromFileName(fileName: string): undefined | FileMetadata {
		if (!fileName.endsWith(this.extension)) {
			fileName = `${fileName}.${this.extension}`;
		}
		return this.files[fileName];
	}
}

export class CalcArea {
	static getMaxArea(area1: Area, area2: Area): Area {
		if (area2.height > area1.height || area2.width > area1.width) {
			return area2;
		}
		return area1;
	}

	static getFromClassMetadata(metadata: ClassMetadata): Area {
		const reduceMaxLength = (length: number, text: string) => {
			length = text.length > length ? text.length : length;
			return  length;
		}

		let signs: string[] = [ metadata.detail.name ];
		metadata.attributes.forEach(attr => signs.push(AttributeFormatter.signature(attr)));
		metadata.methods.forEach(method => signs.push(MethodFormatter.signature(method)));
		const maxLength = signs.reduce(reduceMaxLength, 0);

		return CalcArea.calc(signs.length, maxLength);
	}

	static calc(height: number, width: number): Area {
		return {
			width: CalcArea.widthToPixel(width),
			height: CalcArea.heightToPixel(height),
		}
	}

	static heightToPixel(height: number): number {
		return height * 16.5;
	}

	static widthToPixel(width: number): number {
		return width * 4;
	}
}

export class AttributeFormatter {
	constructor(private attr: Attribute) { }

	static signature(attr: Attribute): string {
		return new AttributeFormatter(attr).getSignature();
	}

	getSignature(): string {
		const symbol = Encapsulation.getSymbol(this.attr.encapsulation);
		const classifier = this.getClassifier();
		const type = this.attr.type == "" ? "" : `: ${this.attr.type}`
		const initial = this.getInitialValue();

		let signature = `${classifier}${this.attr.name}${type}${initial}`;
		if (this.attr.isStatic) {
			signature = new ItalicTemplate({ text: signature }).getHtml();
		}

		return `${symbol} ${signature}`;
	}

	private getClassifier(): string {
		const classifier: string[] = [];
		if (this.attr.isStatic) {
			classifier.push("static");
		}

		if (this.attr.isFinal) {
			classifier.push("final");
		}
		
		return classifier.length == 0 ? "" : `${classifier.join(" ")}&nbsp;`;
	}

	private getInitialValue(): string {
		const initial = (this.attr.initialValue ?? "").replace("=", "").trim();
		if (initial.length == 0) {
			return "";
		}
		return ` = ${initial}`;
	}
}

export class MethodFormatter {

	constructor(private method: Method) { }

	static signature(method: Method): string {
		return new MethodFormatter(method).getSignature();
	}

	getSignature(): string {
		const symbol = Encapsulation.getSymbol(this.method.encapsulation);
		const classifier = this.getClassifier();
		const name = this.method.name;
		const args = this.getArgsName();
		const returnType = this.getReturnType();

		let signature = `${classifier}${name}(${args}): ${returnType}`
		if (this.method.isStatic) {
			signature = new ItalicTemplate({ text: signature }).getHtml();
		}

		return `${symbol} ${signature}`;
	}


	private getArgsName(): string {
		const mapArgName = (arg: Args): string => {
			let name = arg.name;
			if (arg.type != undefined) {
				name += `: ${arg.type}`;
			}
		
			if (arg.initialValue != undefined) {
				name += ` = ${arg.initialValue}`;
			}
			return FrontEnd.scapeHtmlEntity(name);
		}
		return this.method.args.map(mapArgName).join(", ");
	}

	private getReturnType(): string {
		if (this.method.returnType == "") {
			return "void";
		}
		return FrontEnd.scapeHtmlEntity(this.method.returnType);
	}

	private getClassifier(): string {
		const classifier: string[] = [];
		if (this.method.isAbstract) {
			classifier.push("abstract");
		}
		
		if (this.method.isStatic) {
			classifier.push("static");
		}
		
		return classifier.length == 0 ? "" : `${classifier.join(" ")}&nbsp;`;
	}
}