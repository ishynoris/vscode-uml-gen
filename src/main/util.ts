import { ExtensionContext, TextDocument, Uri, WorkspaceFolder, workspace } from "vscode"
import { FileMetadata, KeyValue } from "./types/parser.type"
import { readFileSync, realpathSync, statSync } from "fs"
import * as path from "path"

export const FileFactory = {
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
	}
}

export const Front = {
	getResourceContent(context: ExtensionContext, fileResource: string): null|string {
		const contextPath = context.extensionPath;
		const resourcePath = "src/front/resource";
		return readFileSync(`${contextPath}/${resourcePath}/${fileResource}`).toString();
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
	
	BlankOp = `[${Regex.Blank}]*`,
	BlankReq = `[${Regex.Blank}]+`,
};
