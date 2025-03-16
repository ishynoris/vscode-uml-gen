import { TextDocument, Uri, WorkspaceFolder, workspace } from "vscode"
import { FileMetadata } from "./types/parser.type"
import { readFileSync, statSync } from "fs"
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