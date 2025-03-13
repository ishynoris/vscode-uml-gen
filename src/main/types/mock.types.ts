import { 
	ClassMetadata, 
	ClassMetadataResult, 
	FileMetadata, 
	IParserFile, 
	MethodResult 
} from "./parser.type"

export const Mock = {
	getMethodResult(): MethodResult {
		return {
			optional: {
				isValid: false,
				value: {
					name: "",
					encapsulation: "",
					returnType: "",
					args: [],
				}
			},
			errors: [],
		}
	},

	getClassMetaData(): ClassMetadata {
		return {
			className: "metadataMock",
			publicMethod: [],
			privateMethod: [],
		}
	},

	getClassMatadata(): ClassMetadata {
		return {
			className: "",
			publicMethod: [],
			privateMethod: [],
		}
	},

	geClassMetadataResult(): ClassMetadataResult {
		return {
			optional: {
				isValid: false,
				value: Mock.getClassMatadata(),
			},
			errors: [ ]
		}
	},
	
	getParserFile(): IParserFile {
		return {
			parse(file: FileMetadata): ClassMetadataResult { 
				return Mock.geClassMetadataResult();
			}
		}
	}
}