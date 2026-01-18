import { Args, Attribute, ClassDetail, ClassMetadata, FileMetadata, Method, Namespace, Package, IgnoreDirs } from "./types/backend.type";
import { FilePath, FileOnDisk, Optional, WorkspaceFiles } from "./types/classes.type";
import { Encapsulation, Allowed as EncapsulationAllowed, Types as EncapsulationType } from "./types/encapsulation.types";
import { IParser, IParserFile, IPackageMapper, ICallback } from "./types/interfaces.type";
import { Mock } from "./types/mock.types";
import { KeyValue } from "./types/general.types";
import { Extensions, Allowed as ExtensionAllowed } from "./types/extension.type";
import { ITemplate, IContainer, Area, VSCodeAPI, FrontMessage, FrontNode, Mesages } from "./types/frontend.type";
import { Exceptions } from "./exception/types";

export namespace ForceGraphWrapper {
	export type NodeObject = {
		id?: string | number;
		index?: number;
		x?: number;
		y?: number;
		vx?: number;
		vy?: number;
		fx?: number;
		fy?: number;
	}
	export type LinkNodes = {
		source?: string | number | NodeObject;
		target?: string | number | NodeObject;
	}
	
	export type GraphData = {
		nodes: NodeObject[],
		links: LinkNodes[],
	}
}

export {
	Args, Attribute, ClassDetail, ClassMetadata, FileMetadata, Method, Namespace, Package, IgnoreDirs,
	FilePath, FileOnDisk, Optional, WorkspaceFiles,
	Encapsulation, EncapsulationAllowed, EncapsulationType,
	IParser, IParserFile, IPackageMapper, ICallback,
	Mock,
	KeyValue,
	Extensions, ExtensionAllowed,
	ITemplate, IContainer, Area, VSCodeAPI, FrontMessage, FrontNode, Mesages,
	Exceptions,
};