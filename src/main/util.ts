import { ExtensionContext, TextDocument, Uri, WorkspaceFolder, window, workspace } from "vscode"
import { readFileSync, statSync } from "fs"
import * as path from "path"
import { Container } from "./Container"
import { FileMetadata } from "../common/types/backend.type"
import { KeyValue } from "../common/types/general.types"

export const FileFactory = {
	fromAbsolutePath(absolutePath: string, loadContent: boolean = true): undefined | FileMetadata {
		const uri = Uri.file(absolutePath);
		try {
			return this.fromUri(uri, loadContent);
		} catch (e) { }
		return undefined;
	},

	fromDocument (doc: TextDocument): FileMetadata {
		return this.fromUri(doc.uri);
	},

	fromUri(uri: Uri, loadContent: boolean = true): FileMetadata {
		const fsPath = uri.fsPath;
		const content = loadContent ? readFileSync(fsPath).toString("utf-8") : "";

		return {
			name: path.basename(fsPath),
			absolutePath: fsPath,
			extension: path.extname(fsPath).replace(".", ""),
			content: content,
		}
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

		const path = folder.uri.path;
		return fileName == undefined ? path : `${path}/${fileName}`;
	},

	getAbsolutePath(extension: string, parts: string[]): undefined | string {
		const workspacePath = this.getWorkspacePath();
		if (workspacePath == null) {
			return undefined;
		}
		const rootFiles = Container.init().getRootFiles(extension);
		const path = parts.join("/");
		return `${workspacePath}/${rootFiles}/${path}`;
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
