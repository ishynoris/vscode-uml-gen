import { ExtensionContext as Context, Uri, Webview } from "vscode";
import { ForceGraphWrapper as FG, ITemplate, VSCodeAPI } from "../../../common/types";
import { Crypto, FileReader } from "../../../main/util";

declare const vscode: VSCodeAPI;

type GraphData = FG.GraphData;

export class HtmlTemplate implements ITemplate {

	private webviewExtensionPath: string;

	constructor (private data: GraphData, private context: Context, private webview: Webview) {
		this.webviewExtensionPath = `${context.extensionPath}/dist`;
	}

	public getHtml(): string {
		const htmlPath = `${this.webviewExtensionPath}/webview/index.html`;
		const htmlContent = FileReader.readContentFromPath(htmlPath).value;
		if (htmlContent == undefined) {
			throw new Error("Resources not loaded");
		}

		return htmlContent.replace("__SCRIPT_UNIQ_ID__", Crypto.getUniqID())
			.replace("__NODES_STRINGIFIED__", JSON.stringify(this.data).replaceAll("\"", "'"))
			.replace("__SRC_FORCE_GRAPH__", this.getDistPath("webview/js/force-graph.min.js"))
			.replace("__SRC_MAIN__", this.getDistPath("webview/js/app.js"))
	}

	private getDistPath(path: string): string {
		const uri = Uri.file(`${this.webviewExtensionPath}/${path}`);
		return this.webview.asWebviewUri(uri).toString();
	}
}
