import { Extensions, IgnoreDirs, FileMetadata, WorkspaceFiles } from "../common/types";
import { JavaParser } from "./../parsers/java/JavaParser";
import { ParserFile } from "./../parsers/ParserFile";
import { PhpParser } from "./../parsers/php/PhpParser";
import { Reader } from "./Reader";
import { Workspace } from "./util";

type WorkspaceFilesType = { [ key: string ] : WorkspaceFiles }; 

const IgnoreFiles: IgnoreDirs = [
	".properties",
	".gitignore",
]

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFilesType;
	public readonly ignoreDirs: IgnoreDirs;
	public readonly ignoreFiles: IgnoreDirs;
	public readonly projectRootDir: string;

	private constructor() {
		this.worspaceFiles = { };
		this.ignoreFiles = IgnoreFiles;
		this.ignoreDirs = Workspace.getIgnoreDirs();
		this.projectRootDir = Workspace.getRootDir();
	}

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container;
			Container.self.worspaceFiles = { };
		}
		return Container.self
	}

	public getWorkspaceFiles(extension: string): WorkspaceFiles {
		if (this.worspaceFiles[extension] == undefined) {
			this.worspaceFiles[extension] = initWorkspace(extension);
		}
		return this.worspaceFiles[extension];
	}

	public getParser(file: FileMetadata): undefined | ParserFile {
		if (!Extensions.isValid(file.extension)) {
			throw new Error(`Cannot parse  "${file.name}". Extension not allowed`);
		}

		const workspace = this.getWorkspaceFiles(file.extension);
		const extension = file.extension.replace(".", "");

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
}

function initWorkspace(extension: string): WorkspaceFiles {
	const reader = new Reader(Extensions.to(extension));

	const files: FileMetadata[] = reader.loadFiles();
	return new WorkspaceFiles(extension, files);
};