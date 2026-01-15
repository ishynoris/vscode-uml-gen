export namespace Exceptions {
	export interface RootDir {
		absolute: string;
		root: string
	}

	export class RootDirNotFoundException extends Error {
		constructor(dir: RootDir) {
			super(`Can not read dir root "${dir.absolute}". Current "Project Root Dir": "/${dir.root}". Verify propetiy on UML Generator seetings.`)
		}
	}
}
