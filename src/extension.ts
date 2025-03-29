import * as vscode from 'vscode';
import { App } from './main/App';
import { Reader } from './main/Reader';
import { Container } from './main/Container';

export function activate(context: vscode.ExtensionContext) {
	Container.init();

	const app = new App(context);
	app.init();
}

export function deactivate() {}
