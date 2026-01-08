import * as ParserFactory from "./../parsers/ParserFactory";
import { ClassMetadata as ClassType, FileMetadata } from "../common/types/backend.type";
import { FileFactory } from "./../main/util";

const CachFile: { [key: string]: ClassType } = { }

export const ClassMetadata = {

	fromAbsolutePath: (absolutePath: string): undefined | ClassType => {
		const file = FileFactory.fromAbsolutePath(absolutePath);
		if (file == undefined) {
			return undefined;
		}
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