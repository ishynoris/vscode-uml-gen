import { 
	window,
	ViewColumn as vc,
	ExtensionContext as Context, 
	TextDocument as TxtDoc, 
	WebviewPanelOptions,
	WebviewOptions
} from 'vscode';
import { Commands, ICreatorFromFile } from "./Commands";
import { Reader } from './Reader';
import { FileMetadata } from "./types/parser.type"
import { getParser } from './parsers/ParserFactory';
import * as FrontEnd from '../front/Front';

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
		const CreatorUmlFromFile = this.createUmlFromFile();

		this.commands.registerComandCreateUML(CreatorUmlFromFile);
		this.commands.registerCommandRightClick(CreatorUmlFromFile);
		this.commands.registerCommandTitleClick(CreatorUmlFromFile);
		this.reader.loadFiles();
	}

	private createUmlFromFile(): ICreatorFromFile {
		const context = this.context;

		return {
			create(file: FileMetadata) {
				const result = getParser(file);
				if (!result.isValid || result.value == undefined) {
					window.showErrorMessage(result.getMessage());
					return;
				}

				const classMetadataOpt = result.value.parse(file);
				if (classMetadataOpt.isValid && classMetadataOpt.value != undefined) {
					FrontEnd.runWebview(context, classMetadataOpt.value);
				}
			}
		}
	}
}
