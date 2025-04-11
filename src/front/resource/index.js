function init(mainContainerId) {
	const $mainContainer = document.getElementById(mainContainerId);
	const $canvas = document.getElementById("canvas");

	const container = new Container($mainContainer, $canvas);
	container.init();
}

function Container($container, $canvas) {
	const getParents = ($nodes) => {
		return $nodes.reduce((acc, $node) => {
			const $parent = $node.closest(".node-container");
			acc[$parent.id] = $parent;
			return acc;
		}, {});
	}

	const $nodes = Array.from($container.getElementsByClassName("node-item"));
	const $parents = getParents($nodes);

	const canvas = new Canvas($canvas);
	const events = new MouseEvents($parents, canvas);

	return {
		init: () => {
			document.onmousemove = events.onMove,
			document.onmouseup = events.onUp;
			$nodes.forEach($node => $node.onmousedown = events.onDown);

			canvas.drawEdges($parents);
		},
	}
}

function Canvas(canvas) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	const context2D = canvas.getContext('2d');
	context2D.strokeStyle = "white";
	context2D.lineWidth = 1;

	const getMidlePosition = ($node) => {
		return {
			x: $node.offsetLeft + $node.clientWidth / 2,
			y: $node.offsetTop + $node.clientHeight / 2,
		}
	}

	const drawStroke = ($node1, $node2) => {
		const initialPosition = getMidlePosition($node1);
		const endPosition = getMidlePosition($node2);

		context2D.moveTo(initialPosition.x, initialPosition.y);
		context2D.lineTo(endPosition.x, endPosition.y);
		context2D.stroke(); 
	}

	return {
		drawEdges: ($nodes) => {
			context2D.clearRect(0, 0, canvas.width, canvas.height);
			context2D.beginPath();

			for (const key in $nodes) {
				const $node = $nodes[key];
				const dataImports = $node.dataset["imports"] ?? "";
				if (dataImports.length == 0) {
					continue;
				}

				const imports = dataImports.split(",");
				imports.forEach(classImport => {
					const keyTarget = `node-${classImport}`.toLowerCase();
					const $nodeTarget = $nodes[keyTarget];
					if ($nodeTarget == undefined) {
						return;
					}

					drawStroke($node, $nodeTarget);
				});
			}
		}
	}
}

function MouseEvents($nodesContainer, canvas) {
	const lastPostion = { x: 0, y: 0 };
	let $currentNode = undefined;

	const setLastMousePosition = (newX, newY) => {
		lastPostion.x = newX;
		lastPostion.y = newY;
	}

	const setNodePosition = (newX, newY) => {
		if ($currentNode == undefined) {
			return;
		}

		$currentNode.style.left = $currentNode.offsetLeft + newX - lastPostion.x + "px";
		$currentNode.style.top  = $currentNode.offsetTop  + newY - lastPostion.y + "px";
		setLastMousePosition(newX, newY);
	}

	const setZAxis = (currentId) => {
		let i = 0;
		const keys = Object.keys($nodesContainer);
		const totalNodes = keys.length;

		keys.forEach(nodeId => {
			const $node = $nodesContainer[nodeId];
			const zIndex = nodeId == currentId ? totalNodes : i;
			$node.style.zIndex = zIndex;
			i++;
		});
	}

	return {
		onDown: (e) => {
			e.preventDefault();
			$currentNode = e.target.closest(".node-container");

			setLastMousePosition(e.clientX, e.clientY);
			setZAxis($currentNode.id);
		},

		onMove: (e) => {
			e.preventDefault();
			setNodePosition(e.clientX, e.clientY);
			canvas.drawEdges($nodesContainer);
		},

		onUp: (e) => {
			e.preventDefault();
			$currentNode = undefined;
		}
	}
}