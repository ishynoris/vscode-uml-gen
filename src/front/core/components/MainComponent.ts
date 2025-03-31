import { Node } from "../Node";
import { Graph, Item } from "../../../common/Graph";
import { ClassMetadata as ClassFacade } from "../../../common/Facade";
import { Component, IComponent } from "../../../common/types/frontend.type";
import { ClassMetadata, Package } from "../../../common/types/backend.type";

export class MainComponent implements IComponent {

	private mainItem: Item<Node>;
	private graph: Graph<Node>;

	constructor(private metadata: ClassMetadata) {
		const mainNode = new Node(metadata);
		const nodes = metadata.imports.reduce(reducePackages, []);
		
		this.mainItem = new Item(mainNode.tag, mainNode);
		this.graph = Graph.from<Node>(this.mainItem, nodes);
	}

	getContent(): Component {
		return this.mainItem.value.getComponent();
	}
}

function reducePackages(itens: Item<Node>[], pack: Package): Item<Node>[] {
	const file = pack.file;
	if (file == undefined) {
		return itens;
	}

	const clsType = ClassFacade.fromFileMetadata(file); 
	if (clsType == undefined) {
		return itens;
	}

	const node = new Node(clsType);
	itens.push(new Item(node.tag, node));
	return itens;
}