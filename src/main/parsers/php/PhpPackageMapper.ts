import { FileMetadata } from "../../../common/types/backend.type";
import { WorkspaceFiles } from "../../../common/types/classes.type";
import { KeyValue } from "../../../common/types/general.types";
import { IPackageMapper } from "../../../common/types/interfaces.type";
import { FileFactory, FileReader, Workspace } from "../../util";

export class PhpPackageMapper implements IPackageMapper {

	private extension: string = "php";
	private psr4Map: KeyValue = { };

	constructor(private workspace: WorkspaceFiles, composerFile: string) {
		this.psr4Map = initComposer(composerFile);
	}

	getFile(parts: string[]): undefined | FileMetadata {
		if (parts.length == 1) {
			const fileName = `${parts[0]}.${this.extension}`;
			return this.workspace.getFromFileName(fileName);
		}

		const currentNamespace = parts[0];
		const currentPath = this.psr4Map[currentNamespace];
		if (currentPath != undefined) {
			const classPath = parts.slice(1).join("/");
			return this.workspace.getFromPath(`${currentPath}/${classPath}.${this.extension}`);
		}

		return undefined;
	}
}

function initComposer(composerFilePath: string): KeyValue {
	const composerFile = FileReader.readFromPath(composerFilePath);
	if (composerFile == "") {
		throw new Error("Cannot load composer file");
	}
	
	const contentJson = JSON.parse(composerFile);
	const psr4 = contentJson["autoload"]["psr-4"] ?? { };
	const workspacePath = Workspace.getWorkspacePath();
	const psr4Content: KeyValue = {  };
	
	for (const key in psr4) {
		const nampesace =  key.replace("\\", "");
		const path = psr4[key];
		psr4Content[nampesace] = `${workspacePath}/${path}`;
	}
	return psr4Content;
}
