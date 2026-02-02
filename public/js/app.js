var appliedListener = false;

export function init(containerId, nodes, vscodeApi) {
	const container = document.getElementById(containerId);
	const graph = new ForceGraph(container)
		.dagMode("radialout") // radialin, td, bu, lr, rl
		.dagLevelDistance(200)
		.cooldownTicks(100)
		// .nodeRelSize(20)
		.dagNodeFilter((e) => {
			debugger;
			return true;
		})
		.onEngineStop((e) => {
			console.log(e);
			graph.cooldownTicks(0)
		})
		.nodeCanvasObject((item, ctx, scale) => {
			if (item.x == undefined && item.y == undefined) {
				return;
			}
			
			if (!appliedListener) {
				appliedListener = true;
				const canvas = ctx.canvas;
				canvas.addEventListener("click", function(e) {
					console.log("appliedListener");
				});
			}

			const { node, x, y } = item;
			const canvas = CanvasNodeDecorator(ctx, scale);
			canvas.render(node, x, y);
		})
		.graphData(nodes);
}

function CanvasNodeDecorator(context2D, scale) {
	return new window.CanvasNodeDecorator(context2D, scale);
}
