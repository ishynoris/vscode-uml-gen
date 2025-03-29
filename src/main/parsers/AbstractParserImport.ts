import { Container } from "../Container";
import { IParseImport, KeyValue, Optional, Package, WorkspaceFiles } from "../types/parser.type";
import { Workspace } from "../util";

export type MetadataImport = {
	file: string,
	package: string,
	filePath?: string,
}

export abstract class AbstractParserImport implements IParseImport {

	private packages: Package[];
	private errors: string[];
	private files!: WorkspaceFiles;
	protected readonly workspacePath: string;

	constructor() {
		const workspacePath = Workspace.getWorkspacePath();
		if (workspacePath == null) {
			throw(`Does not exists a Worksapce`);
		}

		this.packages = [];
		this.errors = [];
		this.files = Container.init().getWorkspaceFiles();
		this.workspacePath = workspacePath;
	}

	protected abstract parserRegexGroup(group: KeyValue): null|MetadataImport;

	protected abstract getRegexPattern(): string;

	parse(content: string): Optional<Package[]> {
		const pattern = this.getRegexPattern();
		const regex = new RegExp(pattern, "gi");
		
		let expression;
		while ((expression = regex.exec(content)) != null) {

			if (expression.groups == undefined) {
				this.errors.push(``);
				continue;
			}

			const regexGroup = this.parserRegexGroup(expression.groups);
			if (regexGroup == null) {
				continue;
			}

			this.packages.push({
				classImported: regexGroup.file,
				package: regexGroup.package,
				filePath: regexGroup.filePath,
			});
		}

		return new Optional(this.packages, this.errors);
	}

	protected hasClass(className: string): boolean {
		return this.files.hasClass(className);
	}
}