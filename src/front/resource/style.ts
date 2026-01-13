export const getCssContent = () => `

.node-container {
	position: absolute;
	top: 0;
	line-height: 14px;
	padding: 5px;
	border: 1px solid white;
	background-color: rgb(29, 27, 27);
}

.node-container .node-item:hover, label:hover {
	cursor: grab;
}

.node-container .node-item:active, label:active {
	cursor: grabbing;
}

.node-container label, i {
	font-size: 10px;
}

.node-collapse:hover, .node-collapse label:hover {
	cursor: pointer;
}

.node-collapse.node-expanded:after {
	content: '\\25B4';
	float: right;
}

.node-collapse:after {
	content: '\\25BE';
	float: right;
}
`.trim();
