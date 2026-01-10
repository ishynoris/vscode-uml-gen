import { commands, window, ExtensionContext, Uri } from "vscode";
import { FileFactory, WindowErrors } from "./util"
import { FileMetadata } from "../common/types/backend.type";

export interface ICreatorFromFile {
	create(document: FileMetadata): void;
}

export class Commands {

	private context: ExtensionContext;

	constructor(context: ExtensionContext) {
		this.context  = context;
	}

	public registerComandCreateUML(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.create", () => {
			const doc = window.activeTextEditor?.document;
			if (doc == undefined) {
				return;
			}
			creator.create(FileFactory.fromDocument(doc));
		});

		this.context.subscriptions.push(command);
	}

	public registerCommandRightClick(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.right-click", (uri: Uri) => createFromActiveDocument(creator, uri));
	}

	public registerCommandTitleClick(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.title-click", (uri: Uri) => createFromActiveDocument(creator, uri));
	}
}

function createFromActiveDocument(creator: ICreatorFromFile, uri?: Uri) {
	const createFile = (): FileMetadata | undefined => {
		if (uri != undefined) {
			return FileFactory.fromUri(uri);
		}

		const doc = window.activeTextEditor?.document;
		if (doc != undefined) {
			return FileFactory.fromDocument(doc);
		}

		return undefined;
	}

	try {
		const file = createFile();
		if (file == undefined) {
			throw new Error("No active document found");
		}
		
		creator.create(file);
	} catch (e) {
		WindowErrors.showError(e);
	}
}
