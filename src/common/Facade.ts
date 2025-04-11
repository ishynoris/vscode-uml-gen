import * as ParserFactory from "../main/parsers/ParserFactory";
import { ClassMetadata as ClassType, FileMetadata } from "../common/types/backend.type";
import { FileFactory, Workspace } from "../main/util";

const CachFile: { [key: string]: ClassType } = { }

export const ClassMetadata = {
	fromPackageParts: (parts: string[]): undefined | ClassType => {
		const absolutePath = Workspace.getAbsolutePath(parts);
		return absolutePath == undefined ? undefined : ClassMetadata.fromAbsolutePath(absolutePath);
	},

	fromAbsolutePath: (absolutePath: string): undefined | ClassType => {
		const file = FileFactory.fromAbsolutePath(absolutePath);
		return ClassMetadata.fromFileMetadata(file);
	},

	fromFileMetadata: (file: FileMetadata): undefined | ClassType => {
		const cached = CachFile[file.name];
		if (cached != undefined) {
			return cached;
		}

		const clsType = ParserFactory.parse(file);
		if (clsType.value == undefined || !clsType.isValid) {
			return undefined;
		}

		CachFile[file.name] = clsType.value;
		return CachFile[file.name];
	}
}