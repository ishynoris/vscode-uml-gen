import * as vscode from "vscode";
import * as fs from "fs";
import { App } from "./App";

export class Commands {

	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	public registerComandCreateUML(): void {
		const context = this.app.context;
		const command = vscode.commands.registerCommand("uml-gen.create", () => {
			const doc = vscode.window.activeTextEditor?.document;
			if (doc == undefined) {
				return;
			}
			this.app.createUml(doc);
		});

		context.subscriptions.push(command);
	}
}
