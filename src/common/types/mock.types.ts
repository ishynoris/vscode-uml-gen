import { Encapsulation } from "./encapsulation.types"
import { ClassMetadata, FileMetadata, Method, Namespace } from "./backend.type"
import { Optional } from "./classes.type"
import { KeyValue } from "./general.types"
import { IParser, IParserFile } from "./interfaces.type"

export const Mock = {
	method: (): Method => {
		return {
			name: "",
			isStatic: false,
			isAbstract: false,
			encapsulation: Encapsulation.allowed.none,
			returnType: "",
			args: [],
		}
	},

	classMatadata: (): ClassMetadata => {
		return {
			path: "",
			namespace: { 
				parts: [] 
			},
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

	getParserContent<T>(): IParser<T> {
		return {
			getPatternRegex(): string {
				return "";
			},

			hasRequiredValues(groups): boolean {
				return false;
			},

			getValue(group: KeyValue): Optional<T> {
				return new Optional<T>;
			}, 
			validator(value: T): string[] {
				return [];
			}
		}
	}
}