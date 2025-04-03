import { Node } from "../Node";
import { Graph, Item } from "../../../common/Graph";
import { ClassMetadata as ClassFacade } from "../../../common/Facade";
import { Component, Coordinates, IComponent, IContainer } from "../../../common/types/frontend.type";
import { ClassMetadata, Package } from "../../../common/types/backend.type";
import { Dom } from "../Dom";
import { CalcArea } from "../../../common/types/classes.type";

type ItemNode = Item<Node>;
const GAP_NODES = 30;

export class MainComponent implements IContainer {

	private initialCoords: Coordinates;
	private mainItem: ItemNode;

	constructor(private metadata: ClassMetadata, private containerId: string) {
		const area = CalcArea.getFromClassMetadata(metadata);
		this.initialCoords = { x: 10, y: 10, ...area };

		const mainNode = new Node(metadata, this.initialCoords);
		this.mainItem = new Item(mainNode.tag, mainNode);
	}

	getContainerId(): string {
		return this.containerId;
	}

	getContent(): Component {
		const nodes = this.getNeigbhorItens();
		const graph = Graph.from(this.mainItem, nodes);

		const childs: Component[] = [];

		graph.exploreFrom(this.mainItem, (node: Node) => childs.push(node.getContent()) );
		return Dom.createDiv({ id: this.containerId }, childs);
	}

	private getNeigbhorItens(): ItemNode[] {
		const currentCoords = Object.assign({}, this.initialCoords);

		const ReducePackage = (itens: ItemNode[], pack: Package): ItemNode[] => {
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
				x: currentCoords.x + currentCoords.width + GAP_NODES,
				y: currentCoords.y,
				width: area.width,
				height: area.height,
			};

			const node = new Node(clsType, coords);
			itens.push(new Item(clsType.detail.name, node));

			currentCoords.y = coords.y + coords.height + GAP_NODES;
			return itens;
		}

		const imports = this.metadata.imports;
		return imports.reduce(ReducePackage, []);
	}
}