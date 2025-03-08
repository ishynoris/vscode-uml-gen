import * as fs from 'fs';
import * as vscode from 'vscode';
import path from 'path';
import { getWorkspacePath } from './Workspace';

export class Reader {
	private path: string;
	private srcPath: string;
	private filesPath: string[];
	private invalidFiles: string[];

	constructor(path: string, srcPath: string = "src") {
		this.path = this.getSrcPath() ?? "";
		this.srcPath = srcPath;
		this.filesPath = [];
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
			this.filesPath.push(filePath);
		}
	}

	private getSrcPath(fileName?: string): null|string {
		let srcPath = getWorkspacePath();
		if (srcPath == null) {
			vscode.window.showErrorMessage("None workspace loaded");
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