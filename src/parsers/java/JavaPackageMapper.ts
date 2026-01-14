import { FileMetadata, WorkspaceFiles, IPackageMapper } from "../../common/types";
import { Workspace } from "../../main/util";

export class JavaPackageMapper implements IPackageMapper {

	private extension: string;

	constructor(private workspace: WorkspaceFiles) {
		this.extension = "java";
	}

	public getFile(parts: string[]): undefined | FileMetadata {
		let name = parts[parts.length - 1];
		name = `${name}.${this.extension}`;
		if (!this.workspace.hasFileName(name)) {
			return undefined;
		}
		
		let absolutePath = Workspace.getAbsolutePath(parts);
		if (absolutePath == undefined) {
			return undefined;
		}

		if (!absolutePath.endsWith(`.${this.extension}`)) {
			absolutePath = `${absolutePath}.${this.extension}`;
		}

		return this.workspace.getFromPath(absolutePath);
	}
}