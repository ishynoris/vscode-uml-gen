import { commands, window, TextDocument, ExtensionContext, Uri } from "vscode";
import { FileFactory } from "./types/factory.types";
import { FileMetadata } from "./types/parser.type";



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
		const command = commands.registerCommand("uml-gen.right-click", (uri: Uri) => {
			creator.create(FileFactory.fromUri(uri));
		});
	}

	public registerCommandTitleClick(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.title-click", (uri: Uri) => {
			creator.create(FileFactory.fromUri(uri));
		});
	}
}
