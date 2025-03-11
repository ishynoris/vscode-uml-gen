import { 
	ExtensionContext as Context, 
	TextDocument as TxtDoc 
} from 'vscode';
import { Commands, ICreatorUml } from "./Commands";
import { Reader } from './Reader';

export class App {
	public readonly context: Context;

	private commands: Commands;
	private reader: Reader;

	constructor(context: Context) {
		this.context = context;
		this.commands = new Commands(this.context);
		this.reader = new Reader(this.context.extensionPath);
	}

	public init() {
		this.commands.registerComandCreateUML(CreatorUmlFromFile);
		this.reader.loadFiles();
	}
}

const CreatorUmlFromFile = {
	onCreate(doc: TxtDoc) {
		const text = doc.getText();
		console.log(text);
	}
}