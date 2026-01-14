import * as fs from 'fs';
import * as path from 'path';
import { FileFactory, WindowErrors, Workspace } from './util';
import { FileMetadata, IgnoreDirs, ExtensionAllowed as Extension } from '../common/types';
import { Container } from './Container';

export class Reader {
	private absolutePath: string;
	private files: FileMetadata[];
	private invalidFiles: string[];
	private ignoreDir: IgnoreDirs;

	constructor(private extension: Extension) {
		const rootDir = Container.init().projectRootDir
		
		this.absolutePath = this.getSrcPath(rootDir);
		this.files = [];
		this.invalidFiles = [
			".properties",
			".gitignore",
		];
		this.ignoreDir = Container.init().ignoreDirs;
	}

	public loadFiles(): FileMetadata[] {
		this.readDirectory(this.absolutePath);
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

	private getSrcPath(fileName?: string): string {
		const srcPath = Workspace.getWorkspacePath(fileName);
		if (srcPath == null) {
			throw new Error("None workspace loaded");
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