export class CanvasNodeDecorator {

	constructor(context2D) {
		this.context2D = context2D;
	}

	render(node, coords, a) {
		debugger;
		const { x, y } = coords.center;
		const w = this.context2D.measureText("dfsdf").width;

		this.context2D.strokeStyle = "green";
		this.context2D.lineWidth = 1;
		this.context2D.beginPath();
		this.context2D.rect(x, y, w, coords.h);
		this.context2D.stroke();
	}
}
