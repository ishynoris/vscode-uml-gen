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
	const $collapse = Array.from($container.getElementsByClassName("node-collapse"));
	const $parents = getParents($nodes);

	const canvas = new Canvas($canvas);
	const events = new MouseEvents($parents, canvas);

	return {
		init: () => {
			window.addEventListener("resize", events.onResize);
			document.onmousemove = events.onMove,
			document.onmouseup = events.onUp;

			$nodes.forEach($node => $node.onmousedown = events.onDown);
			$collapse.forEach($div => $div.addEventListener("click", events.onCollapse));

			canvas.drawEdges($parents);
		},
	}
}

function Canvas(canvas) {
	const getMidlePosition = ($node) => {
		return {
			x: $node.offsetLeft + $node.clientWidth / 2,
			y: $node.offsetTop + $node.clientHeight / 2,
		}
	}

	const drawStroke = ($node1, $node2) => {
		const initialPosition = getMidlePosition($node1);
		const endPosition = getMidlePosition($node2);

		this.context2D.moveTo(initialPosition.x, initialPosition.y);
		this.context2D.lineTo(endPosition.x, endPosition.y);
		this.context2D.stroke(); 
	}

	const initContext2D = (width, height) => {
		canvas.width = width;
		canvas.height = height;
		
		const context = canvas.getContext('2d');
		context.strokeStyle = "white";
		context.lineWidth = 1;
		return context;
	}

	this.context2D = initContext2D(window.innerWidth, window.innerHeight);

	return {
		setSize: (width, height) => {
			this.context2D = initContext2D(width, height);
		},

		drawEdges: ($nodes) => {
			this.context2D.clearRect(0, 0, canvas.width, canvas.height);
			this.context2D.beginPath();

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

	const onDowmNode = ($target, x, y) => {
		$currentNode = $target.closest(".node-container");
		setLastMousePosition(x, y)/
		setZAxis($currentNode.id);
	}

	const onMoveNode = (newX, newY) => {
		if ($currentNode == undefined) {
			return;
		}

		$currentNode.style.left = $currentNode.offsetLeft + newX - lastPostion.x + "px";
		$currentNode.style.top  = $currentNode.offsetTop  + newY - lastPostion.y + "px";
		setLastMousePosition(newX, newY);

		canvas.drawEdges($nodesContainer);
	}

	const onDropNode = () => {
		$currentNode = undefined;
	}

	const onCollapseNode = ($target) => {
		const $divTitle = $target.closest(".node-collapse");
		const targetId = $divTitle.dataset["collapse"];

		const $divContent = document.querySelector(`#${targetId}`);
		const isDisplaBlock = ($divContent.style.display ?? "") == "block";

		if (isDisplaBlock) {
			$divContent.style.display = "none";
			$divTitle.classList.remove("node-expanded");
		} else {
			$divContent.style.display = "block";
			$divTitle.classList.add("node-expanded");
		}

		canvas.drawEdges($nodesContainer);
	}

	const onWindowResize = (currenWindow) => {
		canvas.setSize(currenWindow.innerWidth, currenWindow.innerHeight);
		canvas.drawEdges($nodesContainer);
	}

	return {
		onDown: (e) => {
			e.preventDefault();
			onDowmNode(e.target, e.clientX, e.clientY);
		},

		onMove: (e) => {
			e.preventDefault();
			onMoveNode(e.clientX, e.clientY);
		},

		onUp: (e) => {
			e.preventDefault();
			onDropNode();
		}, 

		onCollapse: (e) => {
			e.preventDefault();
			onCollapseNode(e.target);
		},
		onResize: (e) => {
			e.preventDefault();
			onWindowResize(e.target);
		}
	}
}