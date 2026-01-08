import * as fs from 'fs';
import * as path from 'path';
import { FileFactory, WindowErrors, Workspace } from './util';
import { FileMetadata } from '../common/types/backend.type';
import { Allowed as Extension } from '../common/types/extension.type';

export class Reader {
	private path: string;
	private srcPath: string;
	private files: FileMetadata[];
	private invalidFiles: string[];
	private ignoreDir: string[];

	constructor(private extension: Extension, srcPath: string = "src") {
		this.path = this.getSrcPath() ?? "";
		this.srcPath = srcPath;
		this.files = [];
		this.invalidFiles = [
			".properties",
			".gitignore",
		];
		this.ignoreDir = [
			".git",
			"tests",
			"vendor",
		]
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
		let files: string[];
		try {
			files = fs.readdirSync(absolutePath, "utf-8");
		} catch (e) {
			throw new Error(`Cannot read dir ${absolutePath}`);
		}
		
		for (const key in files) {
			const dirName = files[key];
			if (this.ignoreDirectory(dirName)) {
				continue;
			}

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
			const file = FileFactory.fromAbsolutePath(filePath);
			if (file == undefined) {
				continue;
			}

			this.files.push(file);
		}
	}

	private getSrcPath(fileName?: string): null|string {
		let srcPath = Workspace.getWorkspacePath();
		if (srcPath == null) {
			WindowErrors.showMessage("None workspace loaded");
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

	private ignoreDirectory(dirName: string): boolean {
		return this.ignoreDir.includes(dirName);
	}
}