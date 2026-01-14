import { ExtensionContext, TextDocument, Uri, WorkspaceFolder, window, workspace } from "vscode"
import { readFileSync } from "fs"
import { Container } from "./Container"
import { FileMetadata, KeyValue, FilePath, Optional, IgnoreDirs } from "../common/types"
import { randomBytes } from "crypto"

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
	readContentFromPath(absolutePath: string): Optional<string> {
		const errors = [];
		let content = undefined;
		try {
			content = readFileSync(absolutePath).toString("utf-8");
		} catch (e) {
			errors.push(`Cannot read content of ${absolutePath}. File not founded`);
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

		const path = folder.uri.fsPath;
		return fileName == undefined ? path : `${path}/${fileName}`;
	},

	getAbsolutePath(parts: string[]): undefined | string {
		const workspacePath = this.getWorkspacePath();
		if (workspacePath == null) {
			return undefined;
		}
		const rootFiles = Container.init().rootDir;
		const path = parts.join("/");
		return `${workspacePath}/${rootFiles}/${path}`;
	},

	getRootDir(): string {
		let config = Workspace.getSectionConfig<string>("projectRootDir", "src");
		if (config.startsWith("/")) {
			config = config.substring(1);
		}
		return config;
	},

	getIgnoreDirs(): IgnoreDirs {
		return Workspace.getSectionConfig<Array<string>>("ignoreDirs", []);
	},

	getSectionConfig<T>(section: string, def: T): T {
		const config = workspace.getConfiguration("uml-gen").get<T>(section);
		return config ?? def;
	}
}

export const Front = {
	getResourceContent(context: ExtensionContext, fileResource: string): null|string {
		const contextPath = context.extensionPath;
		const resourcePath = "src/front/resource";
		return readFileSync(`${contextPath}/${resourcePath}/${fileResource}`).toString();
	},

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
