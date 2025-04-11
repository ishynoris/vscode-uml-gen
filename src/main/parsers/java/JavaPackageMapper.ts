import { IPackageMapper } from "../../../common/types/interfaces.type";
import { Workspace } from "../../util";

export class JavaPackageMapper implements IPackageMapper {

	private extension: string;
	constructor() {
		this.extension = "java";
	}

	public packageToPath(parts: string[]): undefined | string {
		let absolutePath = Workspace.getAbsolutePath(this.extension, parts);
		if (absolutePath == undefined) {
			return undefined;
		}

		if (!absolutePath.endsWith(`.${this.extension}`)) {
			absolutePath = `${absolutePath}.${this.extension}`;
		}

		return absolutePath;
	}
}