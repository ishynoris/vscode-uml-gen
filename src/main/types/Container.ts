import { Reader } from "../Reader";
import { MapFilesMetada, WorkspaceFiles } from "./parser.type";

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFiles;

	public static init(): Container {
		if (Container.self == undefined) {
			Container.self = new Container;
			Container.self.initWorkspace();
		}
		return Container.self
	}

	private initWorkspace()  {
		const files: MapFilesMetada = new Reader().loadFiles();
		this.worspaceFiles = new WorkspaceFiles(files);
	}

	public getWorkspaceFiles(): WorkspaceFiles {
		return this.worspaceFiles;
	}
}
