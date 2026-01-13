import { FileMetadata, WorkspaceFiles, Extensions, ExtensionAllowed as ExtensionType, KeyValue } from "../common/types";
import { JavaParser } from "./../parsers/java/JavaParser";
import { ParserFile } from "./../parsers/ParserFile";
import { PhpParser } from "./../parsers/php/PhpParser";

type WorkspaceFilesType = { [ key: string ] : WorkspaceFiles }; 
type IgnoreDir = string[];
type IgnoreFile = string[];

const RootFiles: KeyValue = {
	"java": "src/main/java",
	"php": "",
}

const IgnoreDirs: IgnoreDir = [
	".git",
	"tests",
	"vendor",
	"bin",
	"logs",
]

const IgnoreFiles: IgnoreFile = [
	".properties",
	".gitignore",
]

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFilesType;
	private rootFiles: KeyValue = {};
	public readonly ignoreDirs: IgnoreDir;
	public readonly ignoreFiles: IgnoreFile;

	private constructor() {
		this.worspaceFiles = { };
		this.rootFiles = RootFiles;
		this.ignoreFiles = IgnoreFiles;
		this.ignoreDirs = IgnoreDirs;
	}

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container();
		}
		return Container.self
	}

	public initWorkspace(extension: string, files: FileMetadata[]) {
		extension = Extensions.sanitize(extension);
		this.worspaceFiles[extension] = new WorkspaceFiles(extension, files);
	}

	public hasWorkspace(extension: string): boolean {
		return this.worspaceFiles[extension] != undefined;
	}

	public getWorkspaceFiles(extension: string): WorkspaceFiles {
		extension = Extensions.sanitize(extension);
		return this.worspaceFiles[extension];
	}

	public getRootFiles(extension: string): string {
		extension = Extensions.sanitize(extension);
		return this.rootFiles[extension];
	}

	public getParser(file: FileMetadata): undefined | ParserFile {
		if (!Extensions.isValid(file.extension)) {
			throw new Error(`Cannot parse  "${file.name}". Extension not allowed`);
		}

		const extension = Extensions.sanitize(file.extension);
		const workspace = this.getWorkspaceFiles(extension);

		if (extension == "java") {
			const parser = new JavaParser(workspace);
			return new ParserFile(parser);
		}

		if (file.extension == "php") {
			const parser = new PhpParser(workspace);
			return new ParserFile(parser);
		}

		return undefined;
	}

	public static ignoreDir(dirName: string): boolean {
		return Container.init().ignoreDirs.includes(dirName);
	}

	public static ignoreFile(fileName: string): boolean {
		return Container.init().ignoreFiles.includes(fileName);
	}

	public static invalidFile(extension: ExtensionType, fileName: string): boolean {
		if (fileName.length == 0) {
			return true;
		}
		if (!fileName.endsWith(extension.toString())) {
			return true;
		}
		return Container.ignoreFile(fileName);
	}
}
