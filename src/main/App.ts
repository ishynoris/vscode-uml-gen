import { 
	window,
	ExtensionContext as Context, 
	TextDocument as TxtDoc 
} from 'vscode';
import { Commands, ICreatorUml } from "./Commands";
import { Reader } from './Reader';
import { getParser } from './parsers/ParserFactory';

export class App {
	public readonly context: Context;

	private commands: Commands;
	private reader: Reader;

	constructor(context: Context) {
		this.context = context;
		this.commands = new Commands(this.context);
		this.reader = new Reader();
	}

	public init() {
		this.commands.registerComandCreateUML(CreatorUmlFromFile);
		this.reader.loadFiles();
	}
}

const CreatorUmlFromFile = {
	onCreate(doc: TxtDoc) {
		const result = getParser(doc);
		if (!result.optional.isValid) {
			const text = doc.getText();
			window.showErrorMessage(result.error ?? "");
			return;
		}

		result.optional.value.parse(doc);
	}
}