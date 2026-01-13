import { WindowErrors, Workspace } from './util';
import { FileMetadata, ExtensionAllowed as Extension, Extensions, FileOnDisk, ICallback, FilePath } from '../common/types';
import { FileType, Uri, workspace } from 'vscode';
import { Container } from './Container';

type ReadDirType = [string, FileType];

export class Reader {
	private path: string;
	private srcPath: string;
	private onLoad!: ICallback<FileMetadata[]>;

	constructor(private extension: Extension, srcPath: string = "src") {
		this.path = this.getSrcPath() ?? "";
		this.srcPath = srcPath;
	}

	public static fromUri(uri: Uri): Reader {
		const filePath = new FilePath(uri);

		const extension = filePath.extension;
		const srcPath = Container.init().getRootFiles(extension);
		return new Reader(Extensions.to(extension), srcPath);
	}

	public async loadFiles(onLoad: ICallback<FileMetadata[]>) {
		this.onLoad = onLoad;
		if (this.path == null) {
			this.onLoad.call([]);
			return;
		}

		const container = Container.init();
		if (container.hasWorkspace(this.extension)) {
			const files = container.getWorkspaceFiles(this.extension).files;
			this.onLoad.call(files);
			return;
		}

		const absolutePath = `${this.path}/${this.srcPath}`; 
		const files = await this.readDirectory(absolutePath);
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
}

