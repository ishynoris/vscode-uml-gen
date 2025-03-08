import * as fs from 'fs';
import * as vscode from 'vscode';

export class Reader {
	private path: string;

	constructor(path: string) {
		this.path = path;
	}

	public loadFiles() {
		fs.readdir(this.path, "utf-8", (err: NodeJS.ErrnoException | null, data: string[]) => {
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