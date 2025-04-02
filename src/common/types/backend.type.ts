import { Allowed } from "./encapsulation.types"

export type FileMetadata = {
	name: string,
	absolutePath: string,
	extension: string,
	content: string,
}

export type Attribute = {
	encapsulation: Allowed,
	type: string,
	name: string,
}

export type Args = {
	name: string,
	type?: string,
	initialValue?: string,
}

export type Method = {
	name: string,
	encapsulation: Allowed,
	returnType: string,
	args: Args[],
}

export type Package = {
	classImported: string,
	package: string,
	file?: FileMetadata,
}
export type ClassDetail = {
	name: string,
	isInterface: boolean,
	isStatic: boolean,
	isAbstract: boolean,
	isEnum: boolean,
}

export type ClassMetadata = {
	detail: ClassDetail,
	attributes: Attribute[],
	imports: Package[],
	methods: Method[],
}