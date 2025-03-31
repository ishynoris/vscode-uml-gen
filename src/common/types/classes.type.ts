import { FileMetadata } from "./backend.type";

export type MapFilesMetada = Map<string,  FileMetadata>;

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

export class WorkspaceFiles {

	private classes: string[] = [];

	constructor(public readonly files: MapFilesMetada) {
		files.forEach((metadata, fileName) => {
			const extension = metadata.extension;
			const className = fileName.replace(extension, "");
			this.classes.push(className);
		});
	}

	hasClass(className: string): boolean {
		return this.classes.includes(className);
	}
}