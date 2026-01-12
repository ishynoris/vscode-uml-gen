enum Type {
	PHP = "php",
	Java = "java",
}

type Dictionary = { [ key: string ]: Allowed }

export type Allowed = Type;

export const Extensions = {
	map: (): Dictionary => {
		return {
			"php": Type.PHP,
			"java": Type.Java,
		}
	},

	sanitize: (extension: string): string => {
		return extension.replace(".", "").toLocaleLowerCase();
	},

	isValid: (extension: string): boolean => {
		extension = Extensions.sanitize(extension);
		const map = Extensions.map();
		return map[extension] != undefined;
	},

	to: (extension: string): Allowed => {
		extension = Extensions.sanitize(extension);
		Extensions.throwErrorIfInvalid(extension);

		const map = Extensions.map();
		return map[extension];
	},

	throwErrorIfInvalid: (extension: string) => {
		extension = Extensions.sanitize(extension);
		if (extension.length == 0) {
			throw new Error(`No extension defined. Extension in blank!`);
		}

		if (!Extensions.isValid(extension)) {
			throw new Error(`Extension "${extension} not allowed."`);
		}
	}
}