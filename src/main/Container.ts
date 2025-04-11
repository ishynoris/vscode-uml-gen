import { FileMetadata } from "../common/types/backend.type";
import { WorkspaceFiles } from "../common/types/classes.type";
import { Extensions } from "../common/types/extension.type";
import { KeyValue } from "../common/types/general.types";
import { IPackageMapper, IParserFile } from "../common/types/interfaces.type";
import { JavaPackageMapper } from "./parsers/java/JavaPackageMapper";
import { JavaParser } from "./parsers/java/JavaParser";
import { ParserFile } from "./parsers/ParserFile";
import { PhpPackageMapper } from "./parsers/php/PhpPackageMapper";
import { PhpParser } from "./parsers/php/PhpParser";
import { Reader } from "./Reader";
import { Workspace } from "./util";

type WorkspaceFilesType = { [ key: string ] : WorkspaceFiles }; 

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
	Extensions.throwErrorIfInvalid(extension);

	const rootFiles = RootFiles[extension];
	const files: FileMetadata[] = new Reader(extension, rootFiles).loadFiles();
	return new WorkspaceFiles(extension, files);
};