import * as vscode from 'vscode';
import { App } from './App';

export function activate(context: vscode.ExtensionContext) {
	const app = new App(context);
	app.init();
}

export function deactivate() {}
