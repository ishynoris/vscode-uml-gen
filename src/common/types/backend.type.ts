import { Allowed as EncAllowed } from "./encapsulation.types"
import { Allowed as ExtAllowed } from "./extension.type"


export type FileMetadata = {
	name: string,
	absolutePath: string,
	extension: ExtAllowed,
}

export type Attribute = {
	encapsulation: EncAllowed,
	type: string,
	name: string,
	isStatic: boolean,
	isFinal: boolean,
	initialValue: undefined | string,
}

export type Args = {
	name: string,
	type?: string,
	initialValue?: string,
}

export type Method = {
	name: string,
	isStatic: boolean,
	isAbstract: boolean,
	encapsulation: EncAllowed,
	returnType: string,
	args: Args[],
}

export type Namespace = {
	parts: string[],
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
	namspace: Namespace,
}

export type ClassMetadata = {
	path: string,
	detail: ClassDetail,
	attributes: Attribute[],
	imports: Package[],
	methods: Method[],
}