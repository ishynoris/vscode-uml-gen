import { Reader } from "./Reader";
import { KeyValue, MapFilesMetada, WorkspaceFiles } from "./types/parser.type";

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFiles;
	private rootFiles: KeyValue = {};

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container;
			Container.self.worspaceFiles = initWorkspace();
			Container.self.rootFiles["java"] = "src/main/java";
		}
		return Container.self
	}

	public getWorkspaceFiles(): WorkspaceFiles {
		return this.worspaceFiles;
	}

	public getRootFiles(extension: string): string {
		return this.rootFiles[extension];
	}
}

function initWorkspace(): WorkspaceFiles  {
	const files: MapFilesMetada = new Reader().loadFiles();
	return new WorkspaceFiles(files);
};