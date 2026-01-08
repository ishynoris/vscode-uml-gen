import { ExtensionContext as Context } from 'vscode';
import { Commands, ICreatorFromFile } from "./Commands";
import { ClassMetadata, FileMetadata } from "../common/types/backend.type"
import * as ParserFactory from '../parsers/ParserFactory';
import { Optional } from '../common/types/classes.type';
import { WindowErrors } from './util';
import { GraphWebviewFactory } from '../front/NodeWebview';

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

		const runWebview = (metadata: Optional<ClassMetadata>) => {
			if (metadata.value == undefined) {
				WindowErrors.showError(metadata.getMessage());
				return;
			}
			const graph = GraphWebviewFactory.create(metadata.value, context);
			graph.render();
		}

		return {
			create(file: FileMetadata) {
				try {
					const classMetadataOpt = ParserFactory.parse(file);
					runWebview(classMetadataOpt);
				} catch (e) {
					WindowErrors.showError(e);
				}
			}
		}
	}
}
