import { Reader } from "./Reader";
import { MapFilesMetada, WorkspaceFiles } from "./types/parser.type";

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFiles;

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container;
			Container.self.worspaceFiles = initWorkspace();
		}
		return Container.self
	}

	public getWorkspaceFiles(): WorkspaceFiles {
		return this.worspaceFiles;
	}
}

function initWorkspace(): WorkspaceFiles  {
	const files: MapFilesMetada = new Reader().loadFiles();
	return new WorkspaceFiles(files);
};