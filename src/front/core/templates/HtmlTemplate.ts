import { ExtensionContext as Context, WebviewPanel } from "vscode";
import { IComponent, IContainer, ITemplate, Position } from "../../../common/types/frontend.type";
import { Front as FrontUtil } from "../../../main/util";

export class HtmlTemplate implements ITemplate {

	constructor (private container: IContainer, private context: Context) {
	}

	public getHtml(): string {
		const cssContent = FrontUtil.getResourceContent(this.context, "index.css");
		const jsContent = FrontUtil.getResourceContent(this.context, "index.js");
		const htmlContent = this.container.getContent().content;
		const containerId = this.container.getContainerId();

		return `
			<html>
				<head> 
					<style>
						${cssContent}
					</style>
					<script>
						${jsContent}
					</script>
				</head>
				<body>
					<canvas id="canvas"></canvas>
					${htmlContent}
				</body>
				<script>
					document.addEventListener("DOMContentLoaded", function() {
						init("${containerId}");
					});
				</script>
			</html>
			`
	}
}
