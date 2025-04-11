import * as fs from 'fs';
import { window } from 'vscode';
import path from 'path';
import { Workspace } from './util';
import { FileMetadata } from '../common/types/backend.type';

export class Reader {
	private path: string;
	private srcPath: string;
	private files: FileMetadata[];
	private invalidFiles: string[];

	constructor(private extension: string, srcPath: string = "src") {
		this.path = this.getSrcPath() ?? "";
		this.srcPath = srcPath;
		this.files = [];
		this.invalidFiles = [
			".properties",
			".gitignore",
		];
	}

	public loadFiles(): FileMetadata[] {
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
			this.files.push({
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
		if (fileName.length == 0) {
			return true;
		}
		if (!fileName.endsWith(this.extension)) {
			return true;
		}
		return this.invalidFiles.includes(fileName);
	}
}