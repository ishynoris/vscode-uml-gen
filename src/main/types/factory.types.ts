import { TextDocument, Uri } from "vscode"
import { FileMetadata } from "./parser.type"

export const FileFactory = {
	fromDocument (doc: TextDocument): FileMetadata {
		return {
			name: doc.fileName,
			absolutePath: "",
			extension: doc.languageId,
			content: doc.getText(),
		}
	},

	fromUri(uri: Uri): FileMetadata {
		return {
			name: "",
			absolutePath: "",
			extension: "",
			content: "",
		}
	}
}