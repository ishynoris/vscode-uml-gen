import { ForceGraph } from "../front/core/ForceGraphWrapper"
import { Node } from "../front/core/Node";
import { ClassMetadata, Coordinates, Package, Position } from "./types";
import { CalcArea } from "./types/classes.type";
import { ClassMetadata as ClassFacade } from "./Facade";

type GraphData = ForceGraph.GraphData;
type Links = ForceGraph.LinkNodes;

export class GraphFactory {
	public static getForceGraphData(
		metadata: ClassMetadata, 
		iniPosi: Position = { x: 0, y: 0 }
	): GraphData {
		return new ForceGraphData(metadata, iniPosi).getGraphData();
	}
}

class ForceGraphData {
	private mainNode: Node;
	private initialCoords: Coordinates;
	
	constructor(private metadata: ClassMetadata, iniPosi: Position = { x: 0, y: 0 }) {
		const area = CalcArea.getFromClassMetadata(metadata);
		this.initialCoords = { ...iniPosi, ...area };

		this.mainNode = new Node(metadata, this.initialCoords);
	}

	public getGraphData(): GraphData {
		const currentCoords = Object.assign({}, this.initialCoords);
		const GAP = 15;

		const ReducePackage = (data: GraphData, pack: Package): GraphData => {
			const file = pack.file;
			if (file == undefined) {
				return data;
			}

			const clsType = ClassFacade.fromFileMetadata(file);
			if (clsType == undefined)  {
				return data;
			}

			const area = CalcArea.getFromClassMetadata(clsType);
			const coords: Coordinates = {
				x: currentCoords.x + currentCoords.width + GAP,
				y: currentCoords.y,
				width: area.width,
				height: area.height,
			};

			const node = new Node(clsType, coords);
			data.nodes.push({ id: node.tag, node: node });
			data.links.push({
				source: this.mainNode.tag,
				target: node.tag,
			});

			currentCoords.y = coords.y + coords.height + GAP;
			return data;
		}

		const imports = this.metadata.imports;
		const data: GraphData = {
			nodes: [{ id: this.mainNode.tag, node: this.mainNode }],
			links: [],
		}
		return imports.reduce(ReducePackage, data);
	}
	
	private getEdges(): Links[] {
		const currentCoords = Object.assign({}, this.initialCoords);
		const GAP = 15;

		const ReducePackage = (itens: Links[], pack: Package): Links[] => {
			const file = pack.file;
			if (file == undefined) {
				return itens;
			}

			const clsType = ClassFacade.fromFileMetadata(file);
			if (clsType == undefined)  {
				return itens;
			}

			const area = CalcArea.getFromClassMetadata(clsType);
			const coords: Coordinates = {
				x: currentCoords.x + currentCoords.width + GAP,
				y: currentCoords.y,
				width: area.width,
				height: area.height,
			};

			const node = new Node(clsType, coords);
			itens.push({
				source: this.mainNode.tag,
				target: node.tag,
			});

			currentCoords.y = coords.y + coords.height + GAP;
			return itens;
		}

		const imports = this.metadata.imports;
		return imports.reduce(ReducePackage, []);
	}
}
