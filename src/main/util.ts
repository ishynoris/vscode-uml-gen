import { TextDocument, Uri, WorkspaceFolder, window, workspace } from "vscode"
import { readFileSync } from "fs"
import { Container } from "./Container"
import { FileMetadata, KeyValue, FilePath, Optional, IgnoreDirs, FileOnDisk } from "../common/types"
import { randomBytes } from "crypto"
import { Commands } from "./Commands"

export const FileFactory = {
	fromAbsolutePath(absolutePath: string): undefined | FileMetadata {
		const uri = Uri.file(absolutePath);
		try {
			return this.fromUri(uri);
		} catch (e) { }
		return undefined;
	},

	fromDocument (doc: TextDocument): FileMetadata {
		return this.fromUri(doc.uri);
	},

	fromUri(uri: Uri): FileMetadata {
		const filePath = new FilePath(uri);
		try {
			filePath.throwErrorIfInvalid();
		} catch (e) {
			const reason = e instanceof Error ? `Reason: ${e.message}` : "";
			throw new Error(`Cannot create UML from ${filePath.fileName}. ${reason}`)
		}

		return filePath.asFileMetaData();
	}
}

export const FileReader = {
	async pathExists(absolutePath: string): Promise<boolean> {
		try {
			await workspace.fs.readDirectory(Uri.file(absolutePath));
		} catch (e) {
			return false;
		}
		return true;
	},

	async readDirs(filePath: string): Promise<FileOnDisk[]> {
		const uri = Uri.file(filePath);
		const dirs = await workspace.fs.readDirectory(uri);
		return dirs.map(([name, type]) => new FileOnDisk(type, `${filePath}/${name}`));
	},

	readContentFromPath(absolutePath: string): Optional<string> {
		const errors = [];
		let content = undefined;
		try {
			content = readFileSync(absolutePath).toString("utf-8");
		} catch (e) {
			const reason = e instanceof Error ? e.message : "File not founded";
			errors.push(`Cannot read content of ${absolutePath}. ${reason}`);
		}
		return new Optional(content, errors);
	},

	readContentFromFile(file: FileMetadata): Optional<string> {
		const contentOpt = FileReader.readContentFromPath(file.absolutePath);
		if (!contentOpt.hasErrors) {
			return contentOpt;
		}
		const message = `Cannot read content from ${file.name} file. Path: ${file.absolutePath}`;
		return new Optional<string>(contentOpt.value, [ message ]);
	}
}

export const Workspace = {
	getWorkspace(): null|WorkspaceFolder {
		 const folder = workspace.workspaceFolders ?? [];
		 return folder.length == 0 ? null : folder[0];
	},
	
	getWorkspaceName(): null|string {
		const folder = this.getWorkspace();
		return folder == null ? null : folder.name;
	},

	getWorkspacePath(fileName?: string): null|string {
		const folder = this.getWorkspace();
		if (folder == null) {
			return null;
		}

		const path = FilePath.sanitizePathFromUri(folder.uri);
		return fileName == undefined ? path : `${path}/${fileName}`;
	},

	getAbsolutePath(parts: string[]): undefined | string {
		const workspacePath = this.getWorkspacePath();
		if (workspacePath == null) {
			return undefined;
		}
		const rootFiles = Container.init().getRootDir();
		const path = parts.join("/");
		return `${workspacePath}/${rootFiles}/${path}`;
	},

	getRootDir(): string {
		let config = Workspace.getSectionConfig<string>(Commands.PROJECT_ROOT_DIR, "src");
		if (config.startsWith("/")) {
			config = config.substring(1);
		}
		return config;
	},

	getIgnoreDirs(): IgnoreDirs {
		return Workspace.getSectionConfig<Array<string>>(Commands.IGNORE_DIRS, []);
	},

	getSectionConfig<T>(section: string, def: T): T {
		const config = workspace.getConfiguration("uml-gen").get<T>(section);
		return config ?? def;
	}
}

export const Front = {
	scapeHtmlEntity(text: string): string {
		const htmlEntity: KeyValue = {
			"<": "&#60;",
			">": "&#62;",
		}

		for (let key in htmlEntity) {
			text = text.replaceAll(key, htmlEntity[key]);
		}
		return text;
	}
}

export const WindowErrors = {
	showMessage: (message: string) => {
		window.showErrorMessage(message);
	},

	showError: (e: any) => {
		if (e instanceof Error) {
			WindowErrors.showMessage(e.message);
			console.log(e);
		}
	}
}

export const Crypto = {
	getUniqID: (size: number = 10) => {
		return randomBytes(size).toString("hex");
	}
}

export enum Regex {
	Blank =`\\s\\t\\n`,
	Letters =`a-zA-Z`,
	Numbers = `0-9`,
	OpenArgs =`\\(`,
	CloseArgs =`\\)`,
	OpenBlock =`\\{`,
	CloseBlock =`\\}`,
	Anything = `.*`,
	
	BlankOp = `[${Regex.Blank}]*`,
	BlankReq = `[${Regex.Blank}]+`,
};
