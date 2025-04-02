import { Encapsulation } from "./encapsulation.types"
import { ClassMetadata, FileMetadata, Method } from "./backend.type"
import { Optional } from "./classes.type"
import { KeyValue } from "./general.types"
import { IParser, IParserFile } from "./interfaces.type"

export const Mock = {
	method: (): Method => {
		return {
			name: "",
			encapsulation: Encapsulation.allowed.none,
			returnType: "",
			args: [],
		}
	},

	classMatadata: (): ClassMetadata => {
		return {
			detail: {
				name: "",
				isAbstract: false,
				isInterface: false,
				isStatic: false,
				isEnum: false,
			},
			attributes: [],
			imports: [],
			methods: [],
		}
	},

	getMethodResult(): Optional<Method> {
		return new Optional(Mock.method())
	},

	getClassMetadataResult(): Optional<ClassMetadata> {
		return new Optional(Mock.classMatadata());
	},
	
	getParserFile(): IParserFile {
		return {
			parse(file: FileMetadata): Optional<ClassMetadata> { 
				return Mock.getClassMetadataResult();
			}
		}
	},

	getParserContent<T>(): IParser<T> {
		return {
			getPatternRegex(): string {
				return "";
			},

			getValue(group: KeyValue): T | undefined {
				return undefined;
			}, 
			validator(value: T): string[] {
				return [];
			}
		}
	}
}