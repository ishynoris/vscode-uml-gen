import { ExtensionContext as Context, WebviewPanel } from "vscode";
import { IContainer, ITemplate, VSCodeAPI } from "../../../common/types/frontend.type";
import { Crypto, Front as FrontUtil } from "../../../main/util";

declare const vscode: VSCodeAPI;

export class HtmlTemplate implements ITemplate {

	constructor (private container: IContainer, private context: Context) {
	}

	public getHtml(): string {
		const uniqId = Crypto.getUniqID();
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
					<script nonce=${uniqId}>
						${jsContent}
					</script>
				</head>
				<body>
					<canvas id="canvas"></canvas>
					${htmlContent}
				</body>
				<script nonce=${uniqId}>
					document.addEventListener("DOMContentLoaded", function() {
						vscode = acquireVsCodeApi();
						init("${containerId}", vscode);
					});
				</script>
			</html>
			`
	}
}
