import * as fs from 'fs';
import { window } from 'vscode';
import path from 'path';
import { Workspace } from './util';
import { FileMetadata, MapFilesMetada } from './types/parser.type';

export class Reader {
	private path: string;
	private srcPath: string;
	private files: MapFilesMetada;
	private invalidFiles: string[];

	constructor(srcPath: string = "src") {
		this.path = this.getSrcPath() ?? "";
		this.srcPath = srcPath;
		this.files = new Map<string, FileMetadata>;
		this.invalidFiles = [
			".properties",
			".gitignore",
		];
	}

	public loadFiles(): MapFilesMetada {
		if (this.path == null) {
			return this.files;
		}

		const absolutePath = `${this.path}/${this.srcPath}`; 
		this.readDirectory(absolutePath);
		return this.files;
	}

	private readDirectory(absolutePath: string) {
		const files = fs.readdirSync(absolutePath, "utf-8");
		
		for (const key in files) {
			let filePath = `${absolutePath}/${files[key]}`;
			const statSync = fs.statSync(filePath);

			if (statSync.isDirectory()) {
				this.readDirectory(filePath);
				continue;
			}
			const extension = path.extname(filePath);
			if (this.isInvalidFile(extension)) {
				continue;
			}

			const name = path.basename(filePath);
			this.files.set(name, {
				name: name,
				absolutePath: filePath,
				extension: extension,
				content: "",
			});
		}
	}

	private getSrcPath(fileName?: string): null|string {
		let srcPath = Workspace.getWorkspacePath();
		if (srcPath == null) {
			window.showErrorMessage("None workspace loaded");
			return null;
		}

		if (fileName != undefined && fileName.length > 1) {
			srcPath = `${srcPath}/${fileName}`;
		}
		return srcPath;
	}

	private isInvalidFile(fileName: string): boolean {
		return this.invalidFiles.includes(fileName);
	}
}