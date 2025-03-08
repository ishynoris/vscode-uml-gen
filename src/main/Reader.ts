import * as fs from 'fs';
import * as vscode from 'vscode';

export class Reader {
	private path: string;
	private srcPath: string;

	constructor(path: string, srcPath: string = "src") {
		this.path = path;
		this.srcPath = srcPath;
	}

	public loadFiles() {
		const srcPath = `${this.path}/${this.srcPath}`;
		fs.readdir(srcPath, "utf-8", (err: NodeJS.ErrnoException | null, data: string[]) => {
			if (err) {
				vscode.window.showErrorMessage(err.message);
				return;
			}
			this.createTree(data);
		})
	}

	private createTree(files: string[]) {
		
	}
}