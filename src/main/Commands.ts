import { commands, window, ExtensionContext, Uri } from "vscode";
import { FileFactory, WindowErrors } from "./util"
import { FileMetadata } from "../common/types/backend.type";
import { Reader } from "./Reader";
import { Container } from "./Container";

export interface ICreatorFromFile {
	create(document: FileMetadata): void;
}

export class Commands {

	private context: ExtensionContext;

	constructor(context: ExtensionContext) {
		this.context  = context;
	}

	public registerComandCreateUML(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.create", () => {
			const doc = window.activeTextEditor?.document;
			if (doc == undefined) {
				return;
			}
			creator.create(FileFactory.fromDocument(doc));
		});

		this.context.subscriptions.push(command);
	}

	public registerCommandRightClick(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.right-click", (uri: Uri) => createFromActiveDocument(creator, uri));
	}

	public registerCommandTitleClick(creator: ICreatorFromFile): void {
		const command = commands.registerCommand("uml-gen.title-click", (uri: Uri) => createFromActiveDocument(creator, uri));
	}
}

async function createFromActiveDocument(creator: ICreatorFromFile, uri?: Uri) {
	const getCurrentUri = () => uri != undefined ? uri : window.activeTextEditor?.document?.uri

	const currentUri = getCurrentUri();

	if (currentUri == undefined) {
		throw new Error("Cannot read current file");
	}

	try {
		await Reader.fromUri(currentUri).loadFiles({
			call(files: FileMetadata[]) {
				const file = FileFactory.fromUri(currentUri);
				if (file == undefined) {
					throw new Error("No active document found");
				}

				Container.init().initWorkspace(file.extension, files);
				creator.create(file);
			}
		});
	} catch (e) {
		WindowErrors.showError(e);
	}
}
