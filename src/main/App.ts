import { 
	window,
	ExtensionContext as Context, 
	TextDocument as TxtDoc 
} from 'vscode';
import { Commands, ICreatorFromFile } from "./Commands";
import { Reader } from './Reader';
import { FileMetadata } from "./types/parser.type"
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
		this.commands.registerCommandRightClick(CreatorUmlFromFile);
		this.commands.registerCommandTitleClick(CreatorUmlFromFile);
		this.reader.loadFiles();
	}
}

const CreatorUmlFromFile: ICreatorFromFile = {
	create(file: FileMetadata) {
		const result = getParser(file);
		if (!result.isValid) {
			const message = result.errors.reduce((err, msg) => msg +=`- ${err}`);
			window.showErrorMessage(message);
			return;
		}

		result.value.parse(file);
	}
}
