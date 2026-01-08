import { commands, window, TextDocument, ExtensionContext, Uri } from "vscode";
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
		const command = commands.registerCommand("uml-gen.right-click", () => createFromActiveDocument(creator));
	}

	public registerCommandTitleClick(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.title-click", () => createFromActiveDocument(creator));
	}
}

function createFromActiveDocument(creator: ICreatorFromFile) {
	const doc = window.activeTextEditor?.document;
	try {
		if (doc == undefined) {
			throw new Error("No active document found");
		}
		
		const file = FileFactory.fromDocument(doc);
		creator.create(file);
	} catch (e) {
		WindowErrors.showError(e);
	}
}
