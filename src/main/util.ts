import { ExtensionContext, TextDocument, Uri, WorkspaceFolder, workspace } from "vscode"
import { readFileSync, statSync } from "fs"
import * as path from "path"
import { Container } from "./Container"
import { FileMetadata } from "../common/types/backend.type"
import { KeyValue } from "../common/types/general.types"

export const FileFactory = {
	fromAbsolutePath(absolutePath: string): FileMetadata {
		const uri = Uri.file(absolutePath);
		return this.fromUri(uri);
	},

	fromDocument (doc: TextDocument): FileMetadata {
		return this.fromUri(doc.uri);
	},

	fromUri(uri: Uri): FileMetadata {
		const fsPath = uri.fsPath;
		const stats = statSync(fsPath);

		return {
			name: path.basename(fsPath),
			absolutePath: fsPath,
			extension: path.extname(fsPath).replace(".", ""),
			content: readFileSync(fsPath).toString("utf-8"),
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

	getWorkspacePath(): null|string {
		const folder = this.getWorkspace();
		return folder == null ? null : folder.uri.path;
	},

	getAbsolutePath(parts: string[]): undefined | string {
		const workspacePath = this.getWorkspacePath();
		if (workspacePath == null) {
			return undefined;
		}
		const rootFiles = Container.init().getRootFiles("java");
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
