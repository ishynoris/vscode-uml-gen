export function init(containerId, nodes, vscodeApi) {
	const container = document.getElementById(containerId);
	const graph = new ForceGraph(container)
		.nodeId('id').graphData(nodes)
		.nodeCanvasObject((item, ctx) => {
			if (item.x == undefined && item.y == undefined) {
				return;
			}
			const { node, x, y } = item;
			const { width, height } = node.coords;
			const coords = {
				x: x,
				y: y,
				w: width,
				h: height,
				center: {
					x: x - (width / 2),
					y: y - (height / 2)
				}
			};
			const canvas = CanvasNodeDecorator(ctx);
			canvas.render(node, coords);
		});
}

function CanvasNodeDecorator(context2D) {
	return new window.CanvasNodeDecorator(context2D);
}
