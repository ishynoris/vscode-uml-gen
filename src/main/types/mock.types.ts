import { Encapsulation } from "./encapsulation.types"
import { 
	ClassMetadata, 
	FileMetadata, 
	IParserFile,
	Method,
	Optional, 
} from "./parser.type"

export const Mock = {
	method: {
		name: "",
		encapsulation: Encapsulation.allowed.none,
		returnType: "",
		args: [],
	},

	classMatadata: {
		className: "",
		methods: [],
	},

	getMethodResult(): Optional<Method> {
		return new Optional(Mock.method)
	},

	getClassMetadataResult(): Optional<ClassMetadata> {
		return new Optional(Mock.classMatadata);
	},
	
	getParserFile(): IParserFile {
		return {
			parse(file: FileMetadata): Optional<ClassMetadata> { 
				return Mock.getClassMetadataResult();
			}
		}
	}
}