function init(containerId, nodes, vscodeApi) {
	const container = document.getElementById(containerId);
	const graph = new ForceGraph(container)
	graph.graphData(nodes);
}
