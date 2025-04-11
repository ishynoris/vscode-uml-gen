import * as vscode from 'vscode';
import { App } from './main/App';
import { Reader } from './main/Reader';
import { Container } from './main/Container';
import { WindowErrors } from './main/util';

export function activate(context: vscode.ExtensionContext) {
	Container.init();

	try {
		const app = new App(context);
		app.init();
	} catch (e) {
		WindowErrors.showError(e);
	}
}

export function deactivate() {}
