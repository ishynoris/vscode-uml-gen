import { window, ExtensionContext as Context } from 'vscode';
import { Commands, ICreatorFromFile } from "./Commands";
import { FileMetadata } from "./types/parser.type"
import { getParser } from './parsers/ParserFactory';
import * as FrontEnd from '../front/Front';

export class App {
	public readonly context: Context;

	private commands: Commands;

	constructor(context: Context) {
		this.context = context;
		this.commands = new Commands(this.context);
	}

	public init() {
		const CreatorUmlFromFile = this.createUmlFromFile();

		this.commands.registerComandCreateUML(CreatorUmlFromFile);
		this.commands.registerCommandRightClick(CreatorUmlFromFile);
		this.commands.registerCommandTitleClick(CreatorUmlFromFile);
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
				if (classMetadataOpt.value != undefined) {
					FrontEnd.runWebview(context, classMetadataOpt.value);
				}
			}
		}
	}
}
