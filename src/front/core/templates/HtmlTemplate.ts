import { ExtensionContext as Context } from "vscode";
import { IContainer, ITemplate, VSCodeAPI } from "../../../common/types";
import { Crypto, Front } from "../../../main/util";

declare const vscode: VSCodeAPI;

export class HtmlTemplate implements ITemplate {

	constructor (private container: IContainer, private context: Context) {
	}

	public getHtml(): string {
		const uniqId = Crypto.getUniqID();
		const htmlContent = this.container.getContent().content;
		const containerId = this.container.getContainerId();

		return `
			<html>
				<head> 
					<style>
						${Front.CssContent}
					</style>
					<script nonce=${uniqId}>
						${Front.JsContetn}
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
