import { 
	ClassMetadata, 
	FileMetadata, 
	IParserFile,
	Method,
	Optional, 
} from "./parser.type"

export const Mock = {
	getMethodResult(): Optional<Method> {
		return {
			isValid: false,
			value: {
				name: "",
				encapsulation: "",
				returnType: "",
				args: [],
			},
			errors: [],
		}
	},

	getClassMatadata(): ClassMetadata {
		return {
			className: "",
			methods: [],
		}
	},

	getClassMetadataResult(): Optional<ClassMetadata> {
		return {
			isValid: false,
			value: Mock.getClassMatadata(),
			errors: [ ]
		}
	},
	
	getParserFile(): IParserFile {
		return {
			parse(file: FileMetadata): Optional<ClassMetadata> { 
				return Mock.getClassMetadataResult();
			}
		}
	}
}