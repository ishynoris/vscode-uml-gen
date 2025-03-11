import * as vscode from "vscode";

export interface ICreatorUml {
	onCreate(document: vscode.TextDocument): void;
}

export class Commands {

	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context  = context;
	}

	public registerComandCreateUML(creator: ICreatorUml): void {
		const command = vscode.commands.registerCommand("uml-gen.create", () => {
			const doc = vscode.window.activeTextEditor?.document;
			if (doc == undefined) {
				return;
			}
			creator.onCreate(doc);
		});

		this.context.subscriptions.push(command);
	}
}
