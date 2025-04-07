import { FileMetadata } from "../common/types/backend.type";
import { MapFilesMetada, Optional, WorkspaceFiles } from "../common/types/classes.type";
import { KeyValue } from "../common/types/general.types";
import { IParserFile } from "../common/types/interfaces.type";
import { JavaParser } from "./parsers/java/JavaParser";
import { PhpParser } from "./parsers/php/PhpParser";
import { Reader } from "./Reader";

type WorkspaceFilesType = { [ key: string] : WorkspaceFiles }; 

const RootFiles: KeyValue = {
	"java": "src/main/java",
	"php": "",
}

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFilesType;
	private rootFiles: KeyValue = {};

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container;
			Container.self.worspaceFiles = { };
			Container.self.rootFiles = RootFiles;
		}
		return Container.self
	}

	public getWorkspaceFiles(extension: string): WorkspaceFiles {
		if (this.worspaceFiles[extension] == undefined) {
			this.worspaceFiles[extension] = initWorkspace(extension);
		}
		return this.worspaceFiles[extension];
	}

	public getRootFiles(extension: string): string {
		return this.rootFiles[extension];
	}

	public getParser(file: FileMetadata): undefined | IParserFile {
		const workspace = this.getWorkspaceFiles(file.extension);

		if (file.extension == "java") {
			return new JavaParser(workspace);
		}

		if (file.extension == "php") {
			return new PhpParser(workspace);
		}
		return undefined;
	}
}

function initWorkspace(extension: string): WorkspaceFiles {
	const rootFiles = RootFiles[extension];
	const files: MapFilesMetada = new Reader(rootFiles).loadFiles();
	return new WorkspaceFiles(files);
};