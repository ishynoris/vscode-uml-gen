import { MapFilesMetada, WorkspaceFiles } from "./parser.type";

export class Container {

	private static self: Container;

	private worspaceFiles!: WorkspaceFiles;

	public static getInstance(): Container {
		if (Container.self == undefined) {
			Container.self = new Container;
		}
		return Container.self
	}

	public setWorkspaceFiles(files: MapFilesMetada): Container {
		this.worspaceFiles = new WorkspaceFiles(files);
		return this;
	}

	public getWorkspaceFiles(): WorkspaceFiles {
		return this.worspaceFiles;
	}
}
