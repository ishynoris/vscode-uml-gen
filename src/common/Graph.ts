export class Item<T> {
	constructor(
		public readonly tag: string, 
		public readonly value: T
	) { }
}

export class Graph<N> {
	private nodes: Map<string, Item<N>[]>;
	private edges: string[];

	constructor() {
		this.nodes = new Map<string, Item<N>[]>;
		this.edges = [];
	}

	static from<T>(main: Item<T>, edges: Item<T>[]): Graph<T> {
		const graph = new Graph<T>;
		graph.addNode(main);
		edges.forEach(item => {
			graph.addNode(item);
			graph.addEdge(main, item)
		});
		return graph;
	}

	public addNode(item: Item<N>) {
		if (this.nodes.has(item.tag)) {
			return;
		}

		this.nodes.set(item.tag, []);
		this.edges.push(item.tag);
	}

	public addEdge(node1: Item<N>, node2: Item<N>) {
		this.nodes.get(node1.tag)?.push(node2);
		this.nodes.get(node2.tag)?.push(node1);
	}
}

