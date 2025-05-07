import { ExtensionContext as Context } from "vscode";
import { IContainer, ITemplate, MessagesUtil, VSCodeAPI } from "../../../common/types/frontend.type";
import { Crypto, Front as FrontUtil } from "../../../main/util";

declare const vscodeApi: VSCodeAPI;

export class HtmlTemplate implements ITemplate {

	constructor (private container: IContainer, private context: Context) {
	}

	public getHtml(): string {
		const uniqId = Crypto.getUniqID();
		const cssContent = FrontUtil.getResourceContent(this.context, "index.css");
		const graphContent = FrontUtil.getResourceContent(this.context, "graph.min.js");
		const jsContent = FrontUtil.getResourceContent(this.context, "index.js");
		const htmlContent = this.container.getContent().content;
		const containerId = this.container.getContainerId();

		return `
			<html>
				<head> 
					<style>
						${cssContent}
					</style>
					<script nonce="data-${uniqId}">
						const FrontMessages = ${MessagesUtil.asString()};
					</script>
					<script nonce="graph-${uniqId}">
						${graphContent}
					</script>
					<script nonce="main-${uniqId}">
						${jsContent}
					</script>
				</head>
				<body>
					<div id="graph"></div>
					${htmlContent}
				</body>
				<script nonce=${uniqId}>
					document.addEventListener("DOMContentLoaded", function() {
						const $divGraph = document.getElementById("graph");
						const graph = new ForceGraph($divGraph);

						vscodeApi = acquireVsCodeApi();
						init("${containerId}", vscodeApi, graph);
					});
				</script>
			</html>
			`
	}
}
