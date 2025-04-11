enum Type {
	PHP = "php",
	Java = "java",
}

type Dictionary = { [ key: string ]: Allowed }

export type Allowed = Type.Java | Type.PHP;

export const Extensions = {
	map: (): Dictionary => {
		return {
			"php": Type.PHP,
			"java": Type.Java,
		}
	},

	isValid: (extension: string): boolean => {
		const map = Extensions.map();
		return map[extension] != undefined;
	},

	throwErrorIfInvalid: (extension: string) => {
		if (!Extensions.isValid(extension)) {
			throw new Error(`Extension "${extension}} not allowed."`);
		}
	}
}