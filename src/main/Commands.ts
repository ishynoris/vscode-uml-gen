import { commands, window, TextDocument, ExtensionContext } from "vscode";

export interface ICreatorUml {
	onCreate(document: TextDocument): void;
}

export class Commands {

	private context: ExtensionContext;

	constructor(context: ExtensionContext) {
		this.context  = context;
	}

	public registerComandCreateUML(creator: ICreatorUml): void {
		const command = commands.registerCommand("uml-gen.create", () => {
			const doc = window.activeTextEditor?.document;
			if (doc == undefined) {
				return;
			}
			creator.onCreate(doc);
		});

		this.context.subscriptions.push(command);
	}
}
