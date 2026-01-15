import { Extensions, ExtensionAllowed as ExtensionType, IgnoreDirs, FileMetadata, WorkspaceFiles } from "../common/types";
import { JavaParser } from "./../parsers/java/JavaParser";
import { ParserFile } from "./../parsers/ParserFile";
import { PhpParser } from "./../parsers/php/PhpParser";
import { Workspace } from "./util";

type WorkspaceFilesType = { [ key: string ] : WorkspaceFiles }; 

const IgnoreFiles: IgnoreDirs = [
	".properties",
	".gitignore",
]

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFilesType;
	private ignoreFiles: IgnoreDirs;

	private constructor() {
		this.worspaceFiles = { };
		this.ignoreFiles = IgnoreFiles;
	}

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container();
		}
		return Container.self
	}

	public getRootDir(): string {
		return Workspace.getRootDir();
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
		const ignoreDirs = Workspace.getIgnoreDirs();
		return ignoreDirs.includes(dirName);
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
