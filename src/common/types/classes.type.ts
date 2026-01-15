import { FileFactory, Front as FrontEnd } from "../../main/util";
import { ItalicTemplate } from "../../front/core/templates/ItalicTemplate";
import { FileType, Uri } from "vscode";
import { 
	Args, Attribute, ClassMetadata, FileMetadata, Method, 
	Encapsulation, 
	Extensions,
	Area,
} from "../../common/types";

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

	private mapFiles: MapFileMetada = { };

	constructor(private extension: string, public readonly files: FileMetadata[]) {
		const ReducePath = (map: MapFileMetada, file: FileMetadata): MapFileMetada => {
			map[file.name] = file;
			return map;
		}

		this.mapFiles = files.reduce(ReducePath, { });
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
		return this.mapFiles[fileName];
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

export class FilePath {
	public readonly extension: string;
	public readonly fileName: string;
	public readonly absolutePath: string;

	constructor(uri: Uri) {
		this.absolutePath = FilePath.sanitizePathFromUri(uri);
		this.extension = Extensions.extract(this.absolutePath);
		this.fileName = FilePath.baseName(this.absolutePath);
	}

	public throwErrorIfInvalid() {
		Extensions.throwErrorIfInvalid(this.extension);
	}

	public asFileMetaData(): FileMetadata {
		return {
			name: this.fileName,
			absolutePath: this.absolutePath,
			extension: Extensions.to(this.extension),
		}
	}

	public static baseName(filePath: string): string {
		const parts = filePath.split("/");
		const lastIndex = parts.length - 1;
		return parts[lastIndex];
	}

	public static sanitizePathFromUri(uri: Uri): string {
		const path = uri.fsPath.replaceAll("\\", "/");
		return path;
	}
}


export class FileOnDisk {

	public readonly isDirectory: boolean;
	public readonly name: string;
	public readonly extension: string;

	constructor(private type: FileType, public readonly absolutePath: string) {
		const filePath = new FilePath(Uri.file(absolutePath));

		this.isDirectory = type == FileType.Directory;
		this.name = filePath.fileName;
		this.extension = filePath.extension;
	}

	public asFileMetadata(): undefined | FileMetadata {
		return FileFactory.fromAbsolutePath(this.absolutePath);
	}
}