function init(containerId) {
	const $container = new Container(containerId);
	$container.init();
}

function Container(containerId) {
	const $container = document.getElementById(containerId);
	const $nodes = Array.from($container.getElementsByClassName("node-item"));
	const events = new MouseEvents($nodes);
	console.log($nodes);

	return {
		$container: $container,
		init: () => {
			document.onmousemove = events.onMove;
			document.onmouseup = events.onUp;
			$nodes.forEach($node => $node.onmousedown = events.onDown);
		},
	}
}

function MouseEvents($nodes) {
	const lastPostion = { x: 0, y: 0 };
	let currentNode = undefined;

	const setLastMousePosition = (newX, newY) => {
		lastPostion.x = newX;
		lastPostion.y = newY;
	}

	const setNodePosition = (newX, newY) => {
		currentNode.style.left = currentNode.offsetLeft + newX - lastPostion.x + "px";
		currentNode.style.top  = currentNode.offsetTop  + newY - lastPostion.y + "px";
		setLastMousePosition(newX, newY);
	}

	return {
		onDown: (e) => {
			e.preventDefault();
			currentNode = e.target.closest(".node-container");

			setLastMousePosition(e.clientX, e.clientY);
		
			var i = 1; 
			for (key in $nodes) {
				const node = $nodes[key];
				if (node.id != currentNode.id) {
					node.style.zIndex = i++; 
				}
			}
		},

		onMove: (e) => {
			e.preventDefault();
			if (currentNode == undefined) {
				return;
			}

			setNodePosition(e.clientX, e.clientY);
		},

		onUp: (e) => {
			e.preventDefault();
			if (currentNode == undefined) {
				return;
			}

			currentNode = undefined;
		}
	}
}