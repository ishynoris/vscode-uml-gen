import * as vscode from 'vscode';
import { Commands } from "./Commands";
import { Reader } from './Reader';

export class App {
	public readonly context: vscode.ExtensionContext;

	private commands: Commands;
	private reader: Reader;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.commands = new Commands(this);
		this.reader = new Reader(this.context.extensionPath);
	}

	public init() {
		this.commands.registerComandCreateUML();
		this.reader.loadFiles();
	}

	public createUml(document: vscode.TextDocument) {

	}
}