import { TextDocument, Uri } from "vscode"
import { FileMetadata } from "./parser.type"
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