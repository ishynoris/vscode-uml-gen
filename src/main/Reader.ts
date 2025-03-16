import * as fs from 'fs';
import { window } from 'vscode';
import path from 'path';
import { Workspace } from './util';

export type FileMetadata = {
	name: string
	path: string,
	extension: string,
}

export class Reader {
	private path: string;
	private srcPath: string;
	private files: Map<string, FileMetadata>;
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

	public loadFiles() {
		if (this.path == null) {
			return;
		}

		const absolutePath = `${this.path}/${this.srcPath}`; 
		this.readDirectory(absolutePath);
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

			filePath = filePath.replace(this.path, "");
			const name = path.basename(filePath);
			this.files.set(name, {
				name: name,
				path: filePath,
				extension: extension
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