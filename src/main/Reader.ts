import { WindowErrors, Workspace } from './util';
import { FileMetadata, ExtensionAllowed as Extension, Extensions, FileOnDisk, ICallback, FilePath } from '../common/types';
import { FileType, Uri, workspace } from 'vscode';
import { Container } from './Container';

type ReadDirType = [string, FileType];

export class Reader {
	private absolutePath: string;
	private onLoad!: ICallback<FileMetadata[]>;

	constructor(private extension: Extension) {
		const rootDir = Container.init().projectRootDir
		this.absolutePath = this.getSrcPath(rootDir);
	}

	public static fromUri(uri: Uri): Reader {
		const filePath = new FilePath(uri);
		const extension = filePath.extension;
		return new Reader(Extensions.to(extension));
	}

	public async loadFiles(onLoad: ICallback<FileMetadata[]>) {
		this.onLoad = onLoad;

		const container = Container.init();
		if (container.hasWorkspace(this.extension)) {
			const files = container.getWorkspaceFiles(this.extension).files;
			this.onLoad.call(files);
			return;
		}

		const files = await this.readDirectory(this.absolutePath);
		this.onLoad.call(files);
	}

	private async readDirectory(absolutePath: string): Promise<FileMetadata[]> {
		const uri = Uri.file(absolutePath);
		const rootFiles: FileMetadata[] = [];

		const dirs = await workspace.fs.readDirectory(uri);
		for (const index in dirs) {
			const [name, type]: ReadDirType = dirs[index];
			if (Container.ignoreDir(name)) {
				continue;
			}

			const filePath  = `${absolutePath}/${name}`;
			const fileDisk = new FileOnDisk(type, filePath);
			if (fileDisk.isDirectory) {
				const files = await this.readDirectory(filePath);
				rootFiles.push(...files);
				continue;
			}

			if (Container.invalidFile(this.extension, fileDisk.name)) {
				continue;
			}

			const metadata = fileDisk.asFileMetadata();
			if (metadata == undefined) {
				continue;
			}

			rootFiles.push(metadata);
		}
		return rootFiles;
	}

	private getSrcPath(fileName?: string): string {
		const srcPath = Workspace.getWorkspacePath(fileName);
		if (srcPath == null) {
			throw new Error("None workspace loaded");
		}
		return srcPath;
	}
}

