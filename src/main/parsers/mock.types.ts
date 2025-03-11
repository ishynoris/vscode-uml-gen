import { TextDocument } from "vscode"
import { ClassMetadata, ClassMetadataResult, IParserFile, MethodResult } from "./parser.type"

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
			errors: [ "ClassMetadataResultMock" ]
		}
	},
	
	getParserFile(): IParserFile {
		return {
			parse(doc: TextDocument): ClassMetadataResult { 
				return Mock.geClassMetadataResult();
			}
		}
	}
}