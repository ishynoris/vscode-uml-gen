import { ExtensionContext as Context, WebviewPanel } from "vscode";
import { Component, IComponent, Position } from "../../../common/types/frontend.type";
import { Dom } from "./../Dom";
import { Front as FrontUtil } from "../../../main/util";

export class HtmlTemplate {

	private currentPosition: Position;
	private contentHtml: string;

	constructor (private wvPanel: WebviewPanel, private context: Context) {
		this.currentPosition = { x: 10, y: 10 };
		this.contentHtml = "";
	}

	render(component: IComponent) {
		this.contentHtml = component.getContent().content;
		this.wvPanel.webview.html = this.getHtml(this.context);
		this.wvPanel.reveal();
	}

	private getHtml(context: Context): string {
		const cssContent = FrontUtil.getResourceContent(context, "index.css");
		const jsContent = FrontUtil.getResourceContent(context, "index.js");

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
					${this.contentHtml}
				<body>
			</html>
			`
	}
}
