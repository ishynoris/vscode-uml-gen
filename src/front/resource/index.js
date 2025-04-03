function init(containerId) {
	const $container = new Container(containerId);
	$container.init();
}

function Container(containerId) {

	const getParents = ($nodes) => {
		const $parents = $nodes.reduce((acc, $node) => {
			const $parent = $node.closest(".node-container");
			acc[$parent.id] = $parent;
			return acc;
		}, {});
		return Object.values($parents);
	}

	const $container = document.getElementById(containerId);
	const $nodes = Array.from($container.getElementsByClassName("node-item"));
	const $parents = getParents($nodes);
	const events = new MouseEvents($parents);

	return {
		$container: $container,
		init: () => {
			document.onmousemove = events.onMove;
			document.onmouseup = events.onUp;
			$nodes.forEach($node => $node.onmousedown = events.onDown);
		},
	}
}

function MouseEvents($nodesContainer) {
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

	const setDepth = (currentId) => {
		const totalNodes = $nodesContainer.length;
		for (let i = 0; i < totalNodes; i++) {
			const $node = $nodesContainer[i];
			const zIndex = $node.id == currentId ? totalNodes : i;
			$node.style.zIndex = zIndex;
		}
	}

	return {
		onDown: (e) => {
			e.preventDefault();
			$currentNode = e.target.closest(".node-container");
			setLastMousePosition(e.clientX, e.clientY);
			setDepth($currentNode.id);
		},

		onMove: (e) => {
			e.preventDefault();
			setNodePosition(e.clientX, e.clientY);
		},

		onUp: (e) => {
			e.preventDefault();
			$currentNode = undefined;
		}
	}
}