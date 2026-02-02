class NodePath2D extends Path2D {
	constructor(node, x, y) {
		super();
		this.node = node;
		this.initX = x;
		this.initY = y;
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx2D 
	 * @param {number} scale
	 */
	render(ctx2D, scale) {
		debugger;
		const metrics = ctx2D.measureText(this.node.tag);
		const width = metrics.width * (scale / 10);
		const height = width;

		const centerX = this.initX - (width / 2);
		const centerY = this.initY - (height / 2);

		
		this.rect(centerX, centerY, width, height);
		ctx2D.strokeStyle = "red";
		ctx2D.strokeRect(centerX, centerY, width, height);

		ctx2D.fillStyle = "white";
		ctx2D.fill(this);

		ctx2D.fillStyle = " 4px black";
		ctx2D.fillText(this.node.tag, centerX + 2, centerY + 8, width - 4);
	}
}

export class CanvasNodeDecorator {

	constructor(context2D, scale) {
		this.context2D = context2D;
		this.scale = scale;
	}

	render(node, x, y) {
		const path = new NodePath2D(node, x, y);
		path.render(this.context2D, this.scale);




		return;
		const blob = createBlob(node);
		const DomURL = window.URL ?? window.webkitURL ?? window;
		const objURL = DomURL.createObjectURL(blob);
		const ctx2D = this.context2D;
		
		const img = new Image;
		img.src = objURL;
		img.onload = function() {
			ctx2D.drawImage(img, x, y);
			DomURL.revokeObjectURL(objURL);
		}
		


		// const { x, y } = coords.center;
		// const w = this.context2D.measureText("dfsdf").width;

		// this.context2D.strokeStyle = "green";
		// this.context2D.lineWidth = 1;
		// this.context2D.beginPath();
		// this.context2D.rect(x, y, w, coords.h);
		// this.context2D.stroke();
	}
}

function createBlob(node) {
	const $label = document.createElement("label");
	$label.textContent = node.tag;
	
	const $span = document.createElement("span");
	$span.textContent = node.metadata.detail.name;

	const $div = document.createElement("div");
	$div.append($label, $span);


	const data = `
		<svg xmlns="http://www.w3.org/2000/svg">
			<foreignObject  width="100%" height="100%">
				<div xmlns="http://www.w3.org/1999/xhtml">
					${$div.outerHTML}
				</div>
			</foreignObject>
		</svg>
	`;
	return new Blob([ data ], { type: "image/svg+xml;charset=utf-8" });
	

}