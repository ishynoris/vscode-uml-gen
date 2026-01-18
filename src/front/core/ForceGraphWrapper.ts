import { Node } from "./Node";

type Edge = string | ForceGraph.NodeObject;

export namespace ForceGraph {
	export type NodeObject = {
		id: string,
		node: Node,
		index?: number;
		x?: number;
		y?: number;
		vx?: number;
		vy?: number;
		fx?: number;
		fy?: number;
	}
	export type LinkNodes = {
		source: Edge,
		target: Edge,
	}
	
	export type GraphData = {
		nodes: NodeObject[],
		links: LinkNodes[],
	}
}
